import uvicorn
import os
import sys

def check_basic_pitch():
    """Check if basic-pitch is properly installed."""
    try:
        from basic_pitch.inference import predict
        from basic_pitch import ICASSP_2022_MODEL_PATH
        print("✓ basic-pitch imported successfully")
        
        if os.path.exists(ICASSP_2022_MODEL_PATH):
            print(f"✓ Model found at: {ICASSP_2022_MODEL_PATH}")
        else:
            print("⚠ Model will be downloaded on first transcription")
        
        return True
    except ImportError as e:
        print(f"✗ basic-pitch import failed: {e}")
        print("Please run: pip install -r requirements.txt")
        return False
    except Exception as e:
        print(f"✗ basic-pitch check failed: {e}")
        return False

if __name__ == "__main__":
    print("🎵 Music Transcription API Server")
    print("=" * 40)
    
    # Check basic-pitch installation
    if not check_basic_pitch():
        print("\nPlease install basic-pitch before starting the server:")
        print("pip install -r requirements.txt")
        print("python setup_basic_pitch.py")
        sys.exit(1)
    
    print("\n🚀 Starting server...")
    print("Frontend should connect to: http://localhost:8000")
    print("API docs available at: http://localhost:8000/docs")
    
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
