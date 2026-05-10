import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader
from agent import run_match_agent

app = FastAPI()

# Enable CORS for local Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CV_STORE_PATH = os.path.join("data", "master_cv.txt")

def extract_text_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

@app.post("/api/upload_cv")
async def upload_cv(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported.")
    
    os.makedirs("data", exist_ok=True)
    temp_pdf_path = os.path.join("data", "temp_cv.pdf")
    
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

    os.makedirs("data", exist_ok=True)
    temp_jd_path = os.path.join("data", "temp_jd.pdf")
    
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

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

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
