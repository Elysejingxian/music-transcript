#!/usr/bin/env python3
"""
Setup script to download and verify basic-pitch model.
Run this once after installing requirements.
"""

import os
from basic_pitch import ICASSP_2022_MODEL_PATH
from basic_pitch.inference import predict
import numpy as np

def setup_basic_pitch():
    """Download and verify basic-pitch model."""
    print("Setting up basic-pitch AI model...")
    
    try:
        # Check if model exists
        if os.path.exists(ICASSP_2022_MODEL_PATH):
            print(f"✓ Model found at: {ICASSP_2022_MODEL_PATH}")
        else:
            print("⚠ Model not found, it will be downloaded on first use")
        
        # Test with a dummy audio file (silence)
        print("Testing basic-pitch functionality...")
        
        # Create a short test audio file (1 second of silence)
        import soundfile as sf
        test_audio = np.zeros(22050)  # 1 second at 22050 Hz
        test_file = "test_audio.wav"
        sf.write(test_file, test_audio, 22050)
        
        # Test prediction (this will download the model if needed)
        try:
            audio, note_events, _ = predict(test_file, model_path=ICASSP_2022_MODEL_PATH)
            print("✓ basic-pitch is working correctly!")
            print(f"✓ Model loaded from: {ICASSP_2022_MODEL_PATH}")
        except Exception as e:
            print(f"✗ Error testing basic-pitch: {e}")
            return False
        finally:
            # Clean up test file
            if os.path.exists(test_file):
                os.remove(test_file)
        
        return True
        
    except Exception as e:
        print(f"✗ Setup failed: {e}")
        return False

if __name__ == "__main__":
    success = setup_basic_pitch()
    if success:
        print("\n🎵 basic-pitch is ready for audio transcription!")
    else:
        print("\n❌ Setup failed. Please check your installation.")
