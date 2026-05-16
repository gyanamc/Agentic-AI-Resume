import os
import gzip as gzip_module
import mimetypes
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel
from pypdf import PdfReader
from backend.agent import run_match_agent

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CV_STORE_PATH = os.path.join(BASE_DIR, "data", "master_cv.txt")


def extract_text_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    return "\n".join(page.extract_text() or "" for page in reader.pages)


@app.on_event("startup")
async def startup_event():
    os.makedirs(os.path.join(BASE_DIR, "data"), exist_ok=True)
    if not os.path.exists(CV_STORE_PATH):
        data_dir = os.path.join(BASE_DIR, "data")
        for filename in os.listdir(data_dir):
            if filename.endswith(".pdf"):
                print(f"Auto-parsing CV from {filename}...")
                cv_text = extract_text_from_pdf(os.path.join(data_dir, filename))
                with open(CV_STORE_PATH, "w") as f:
                    f.write(cv_text)
                break


# ── CV Upload ──────────────────────────────────────────────
@app.post("/api/upload_cv")
async def upload_cv(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported.")
    os.makedirs(os.path.join(BASE_DIR, "data"), exist_ok=True)
    temp_pdf_path = os.path.join(BASE_DIR, "data", "temp_cv.pdf")
    with open(temp_pdf_path, "wb") as buffer:
        buffer.write(await file.read())
    try:
        cv_text = extract_text_from_pdf(temp_pdf_path)
        with open(CV_STORE_PATH, "w") as f:
            f.write(cv_text)
        return {"message": "CV uploaded and parsed successfully", "length": len(cv_text)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {str(e)}")


# ── JD Match ───────────────────────────────────────────────
class MatchRequest(BaseModel):
    jd_text: str


@app.post("/api/match")
async def match_jd_text(request: MatchRequest):
    if not os.path.exists(CV_STORE_PATH):
        raise HTTPException(status_code=400, detail="No Master CV uploaded yet.")
    with open(CV_STORE_PATH, "r") as f:
        cv_text = f.read()
    try:
        return run_match_agent(request.jd_text, cv_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/match_file")
async def match_jd_file(file: UploadFile = File(...)):
    if not os.path.exists(CV_STORE_PATH):
        raise HTTPException(status_code=400, detail="No Master CV uploaded yet.")
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF JDs are supported.")
    os.makedirs(os.path.join(BASE_DIR, "data"), exist_ok=True)
    temp_jd_path = os.path.join(BASE_DIR, "data", "temp_jd.pdf")
    with open(temp_jd_path, "wb") as buffer:
        buffer.write(await file.read())
    jd_text = extract_text_from_pdf(temp_jd_path)
    with open(CV_STORE_PATH, "r") as f:
        cv_text = f.read()
    try:
        return run_match_agent(jd_text, cv_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── AI Chat ────────────────────────────────────────────────
KB_PATH = os.path.join(BASE_DIR, "data", "kumar_knowledge_base.txt")
_kb_text: str | None = None


def get_kb_text() -> str:
    global _kb_text
    if _kb_text is None:
        _kb_text = open(KB_PATH).read() if os.path.exists(KB_PATH) else ""
    return _kb_text


class ChatRequest(BaseModel):
    message: str


@app.post("/api/chat")
async def chat(request: ChatRequest):
    import openai
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not set.")
    kb = get_kb_text()
    system_prompt = f"""You are Kumar Gyanam's personal AI assistant embedded in his interactive resume portfolio.
Answer questions about Kumar's professional background, technical expertise, career history, achievements, and fit for roles — using ONLY the knowledge base below.

Rules:
- Answer in markdown format (use **bold**, bullet points, headers where appropriate)
- Be concise but complete — 3-6 sentences or a short bullet list is ideal
- Speak about Kumar in third person (e.g. "Kumar has..." not "I have...")
- If asked about contact details: Email — gyanamc@gmail.com | LinkedIn — linkedin.com/in/kumar-gyanam
- If a question is outside the knowledge base, say: "I don't have that specific detail, but you can reach Kumar directly at gyanamc@gmail.com"
- Never make up facts not present in the knowledge base

KNOWLEDGE BASE:
{kb}
"""
    client = openai.OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.3,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": request.message},
        ],
    )
    return {"answer": response.choices[0].message.content}


# ── Resume Download ────────────────────────────────────────
@app.get("/api/download-resume")
async def download_resume():
    paths_to_try = [
        os.path.join(BASE_DIR, "data", "Kumar_Gyanam__Resume.pdf"),
        os.path.join(BASE_DIR, "data", "Kumar_Gyanam_Chief_AI_Architect_SBI_Card_Resume.pdf"),
    ]
    resume_file = next((p for p in paths_to_try if os.path.exists(p)), None)
    if not resume_file:
        raise HTTPException(status_code=404, detail="Resume file not found.")
    return FileResponse(
        resume_file,
        media_type="application/pdf",
        filename="Kumar_Gyanam_Resume.pdf",
        headers={"Content-Disposition": "attachment; filename=Kumar_Gyanam_Resume.pdf"},
    )


# ── Contact ────────────────────────────────────────────────
class ContactRequest(BaseModel):
    recruiter_name: str
    recruiter_email: str
    message: str


@app.post("/api/contact")
async def contact(request: ContactRequest):
    gmail_user = "gyanamc@gmail.com"
    gmail_app_password = os.environ.get("GMAIL_APP_PASSWORD")
    if not gmail_app_password:
        raise HTTPException(status_code=500, detail="Email service not configured.")
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[AGENT_KUMAR] New Recruiter Inquiry from {request.recruiter_name}"
        msg["From"] = gmail_user
        msg["To"] = gmail_user
        msg["Reply-To"] = request.recruiter_email
        html_body = f"""
        <html><body style="font-family:Arial,sans-serif;background:#0a0a0a;color:#fff;padding:32px;">
          <div style="max-width:560px;margin:0 auto;background:#111;border:1px solid #222;border-radius:12px;padding:32px;">
            <h2 style="color:#00ffcc;margin-top:0;">New Recruiter Inquiry</h2>
            <p><strong>Name:</strong> {request.recruiter_name}</p>
            <p><strong>Email:</strong> {request.recruiter_email}</p>
            <hr style="border-color:#222;margin:24px 0;"/>
            <p style="color:#888;">Message:</p>
            <p style="color:#ccc;line-height:1.6;white-space:pre-wrap;">{request.message}</p>
          </div>
        </body></html>
        """
        msg.attach(MIMEText(html_body, "html"))
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(gmail_user, gmail_app_password)
            server.sendmail(gmail_user, gmail_user, msg.as_string())
        return {"message": "Email sent successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")


# ── Static files + SPA fallback with gzip compression ─────
DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dist")

COMPRESSIBLE_TYPES = {
    "application/javascript", "text/css", "text/html",
    "application/json", "image/svg+xml", "text/plain",
}

if os.path.exists(DIST_DIR):
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def catch_all(full_path: str, request: Request):
        file_path = os.path.join(DIST_DIR, full_path)
        if os.path.isfile(file_path):
            mime_type, _ = mimetypes.guess_type(file_path)
            accept_encoding = request.headers.get("accept-encoding", "")
            if mime_type in COMPRESSIBLE_TYPES and "gzip" in accept_encoding:
                with open(file_path, "rb") as f:
                    content = gzip_module.compress(f.read(), compresslevel=6)
                is_asset = full_path.startswith("assets/")
                return Response(
                    content=content,
                    media_type=mime_type,
                    headers={
                        "Content-Encoding": "gzip",
                        "Cache-Control": "public, max-age=31536000, immutable"
                        if is_asset else "public, max-age=3600",
                        "Vary": "Accept-Encoding",
                    },
                )
            return FileResponse(file_path)
        return FileResponse(os.path.join(DIST_DIR, "index.html"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
