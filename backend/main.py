import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader
from backend.agent import run_match_agent

app = FastAPI()

# Enable CORS for local Vite dev server
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
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

@app.on_event("startup")
async def startup_event():
    os.makedirs(os.path.join(BASE_DIR, "data"), exist_ok=True)
    if not os.path.exists(CV_STORE_PATH):
        # Look for any PDF in the data directory and parse it
        data_dir = os.path.join(BASE_DIR, "data")
        for filename in os.listdir(data_dir):
            if filename.endswith(".pdf"):
                print(f"Auto-parsing CV from {filename}...")
                cv_text = extract_text_from_pdf(os.path.join(data_dir, filename))
                with open(CV_STORE_PATH, "w") as f:
                    f.write(cv_text)
                break

@app.post("/api/upload_cv")
async def upload_cv(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
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

class MatchRequest(BaseModel):
    jd_text: str

@app.post("/api/match")
async def match_jd_text(request: MatchRequest):
    if not os.path.exists(CV_STORE_PATH):
        raise HTTPException(status_code=400, detail="No Master CV uploaded yet. Please upload a CV first.")
    
    with open(CV_STORE_PATH, "r") as f:
        cv_text = f.read()
        
    try:
        result = run_match_agent(request.jd_text, cv_text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/match_file")
async def match_jd_file(file: UploadFile = File(...)):
    if not os.path.exists(CV_STORE_PATH):
        raise HTTPException(status_code=400, detail="No Master CV uploaded yet. Please upload a CV first.")
        
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF JDs are supported right now.")

    os.makedirs(os.path.join(BASE_DIR, "data"), exist_ok=True)
    temp_jd_path = os.path.join(BASE_DIR, "data", "temp_jd.pdf")
    
    with open(temp_jd_path, "wb") as buffer:
        buffer.write(await file.read())
        
    jd_text = extract_text_from_pdf(temp_jd_path)
    
    with open(CV_STORE_PATH, "r") as f:
        cv_text = f.read()
        
    try:
        result = run_match_agent(jd_text, cv_text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ContactRequest(BaseModel):
    recruiter_name: str
    recruiter_email: str
    message: str

@app.post("/api/contact")
async def contact(request: ContactRequest):
    gmail_user = "gyanamc@gmail.com"
    gmail_app_password = os.environ.get("GMAIL_APP_PASSWORD")

    if not gmail_app_password:
        raise HTTPException(status_code=500, detail="Email service not configured. GMAIL_APP_PASSWORD is not set.")

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[AGENT_KUMAR] New Recruiter Inquiry from {request.recruiter_name}"
        msg["From"] = gmail_user
        msg["To"] = gmail_user
        msg["Reply-To"] = request.recruiter_email

        html_body = f"""
        <html><body style="font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; padding: 32px;">
          <div style="max-width: 560px; margin: 0 auto; background: #111; border: 1px solid #222; border-radius: 12px; padding: 32px;">
            <h2 style="color: #00ffcc; margin-top: 0;">New Recruiter Inquiry</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #888; width: 140px;">Name</td>
                  <td style="padding: 8px 0; color: #fff;">{request.recruiter_name}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Email</td>
                  <td style="padding: 8px 0; color: #0088ff;">{request.recruiter_email}</td></tr>
            </table>
            <hr style="border-color: #222; margin: 24px 0;" />
            <p style="color: #888; margin-bottom: 8px;">Message:</p>
            <p style="color: #ccc; line-height: 1.6; white-space: pre-wrap;">{request.message}</p>
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


from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# ── Resume download endpoint ───────────────────────────────
RESUME_PATH = os.path.join(BASE_DIR, "data", "Kumar_Gyanam__Resume.pdf")

@app.get("/api/download-resume")
async def download_resume():
    # Try new filename first, fall back to old one
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
        headers={"Content-Disposition": "attachment; filename=Kumar_Gyanam_Resume.pdf"}
    )

# Serve static files and SPA fallback
DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dist")
if os.path.exists(DIST_DIR):
    # Mount assets folder directly
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
    
    @app.get("/{full_path:path}")
    async def catch_all(full_path: str):
        # Serve exact file if it exists (e.g., favicon.ico, vite.svg)
        file_path = os.path.join(DIST_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        # Fallback to index.html for any other route
        return FileResponse(os.path.join(DIST_DIR, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
