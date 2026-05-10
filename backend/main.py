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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
