from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import uuid
import os
import json
from app.utils import transcribe_audio

app = FastAPI(title="Music Transcription API", version="1.0.0")

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
MIDI_DIR = "midi"
ANALYSIS_DIR = "analysis"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(MIDI_DIR, exist_ok=True)
os.makedirs(ANALYSIS_DIR, exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Music Transcription API", "version": "1.0.0"}

@app.post("/transcribe/")
async def transcribe(file: UploadFile = File(...)):
    try:
        # Validate file type
        allowed_types = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/x-wav"]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        file_id = str(uuid.uuid4())
        input_path = f"{UPLOAD_DIR}/{file_id}_{file.filename}"
        output_path = f"{MIDI_DIR}/{file_id}.mid"
        analysis_path = f"{ANALYSIS_DIR}/{file_id}_analysis.json"

        # Save uploaded file
        with open(input_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Transcribe audio and get analysis data
        analysis_data = transcribe_audio(input_path, output_path)
        
        # Save analysis data
        with open(analysis_path, "w") as f:
            json.dump(analysis_data, f, indent=2)

        return {
            "file_id": file_id,
            "filename": file.filename,
            "midi_url": f"/download/midi/{file_id}",
            "analysis": analysis_data
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

@app.get("/download/midi/{file_id}")
async def download_midi(file_id: str):
    midi_path = f"{MIDI_DIR}/{file_id}.mid"
    if not os.path.exists(midi_path):
        raise HTTPException(status_code=404, detail="MIDI file not found")
    
    return FileResponse(
        midi_path, 
        media_type='audio/midi', 
        filename=f"{file_id}.mid"
    )

@app.get("/analysis/{file_id}")
async def get_analysis(file_id: str):
    analysis_path = f"{ANALYSIS_DIR}/{file_id}_analysis.json"
    if not os.path.exists(analysis_path):
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    with open(analysis_path, "r") as f:
        return json.load(f)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
