from basic_pitch.inference import predict
from basic_pitch import ICASSP_2022_MODEL_PATH
import librosa
import numpy as np
import pretty_midi
import json
from typing import Dict, List, Any
import os

def transcribe_audio(input_path: str, output_path: str) -> Dict[str, Any]:
    """
    Transcribe audio file to MIDI using basic-pitch AI model and return analysis data.
    
    Args:
        input_path: Path to input audio file
        output_path: Path to output MIDI file
        
    Returns:
        Dictionary containing transcription analysis data
    """
    try:
        print(f"Starting transcription of {input_path}")
        
        # Use basic-pitch for AI-powered transcription
        audio, note_events, _ = predict(input_path, model_path=ICASSP_2022_MODEL_PATH)
        
        # Save MIDI file
        note_events.write(output_path)
        print(f"MIDI saved to {output_path}")
        
        # Load audio for additional analysis
        y, sr = librosa.load(input_path, sr=22050)
        
        # Extract tempo and beats
        tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
        
        # Extract notes from basic-pitch results
        notes = extract_notes_from_midi(note_events)
        
        # Chord detection using librosa
        chroma = librosa.feature.chroma_stft(y=y, sr=sr)
        chord_progression = detect_chords_from_chroma(chroma)
        
        # Key detection
        key = detect_key_from_chroma(chroma)
        
        # Instrument detection based on note characteristics
        instruments = analyze_instruments(notes, y, sr)
        
        # Analysis data to return
        analysis_data = {
            "tempo": float(tempo),
            "key": key,
            "time_signature": "4/4",  # Could be enhanced with beat tracking
            "duration": float(len(y) / sr),
            "notes": notes[:100],  # Limit for response size
            "chord_progression": chord_progression,
            "instruments": instruments,
            "transcription_method": "basic-pitch AI",
            "model_confidence": calculate_transcription_confidence(notes)
        }
        
        print(f"Transcription complete: {len(notes)} notes detected")
        return analysis_data
        
    except Exception as e:
        print(f"Error in transcribe_audio: {e}")
        # Return fallback data with error info
        return {
            "tempo": 120.0,
            "key": "C Major",
            "time_signature": "4/4",
            "duration": 180.0,
            "notes": [],
            "chord_progression": ["C", "F", "G", "C"],
            "instruments": {
                "piano": {"detected": False, "confidence": 0.0, "notes": []},
                "guitar": {"detected": False, "confidence": 0.0, "chords": []},
                "drums": {"detected": False, "confidence": 0.0, "pattern": "Unknown"}
            },
            "transcription_method": "basic-pitch AI (failed)",
            "model_confidence": 0.0,
            "error": str(e)
        }

def extract_notes_from_midi(midi_data):
    """Extract note information from PrettyMIDI object."""
    notes = []
    
    for instrument in midi_data.instruments:
        for note in instrument.notes:
            notes.append({
                "pitch": float(note.pitch),
                "time": float(note.start),
                "duration": float(note.end - note.start),
                "velocity": int(note.velocity),
                "instrument": instrument.program
            })
    
    # Sort notes by time
    notes.sort(key=lambda x: x["time"])
    return notes

def detect_chords_from_chroma(chroma):
    """Enhanced chord detection from chroma features."""
    # Chord templates for major and minor chords
    chord_templates = {
        'C': np.array([1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0]),
        'C#': np.array([0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0]),
        'D': np.array([0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0]),
        'D#': np.array([0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0]),
        'E': np.array([0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1]),
        'F': np.array([1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0]),
        'F#': np.array([0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0]),
        'G': np.array([0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1]),
        'G#': np.array([1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0]),
        'A': np.array([0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0]),
        'A#': np.array([0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0]),
        'B': np.array([0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1]),
        # Minor chords
        'Cm': np.array([1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0]),
        'Dm': np.array([0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0]),
        'Em': np.array([0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1]),
        'Fm': np.array([1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0]),
        'Gm': np.array([0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]),
        'Am': np.array([1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0]),
    }
    
    # Analyze chroma in segments
    segment_length = chroma.shape[1] // 8  # Divide into 8 segments
    detected_chords = []
    
    for i in range(8):
        start_idx = i * segment_length
        end_idx = min((i + 1) * segment_length, chroma.shape[1])
        segment_chroma = np.mean(chroma[:, start_idx:end_idx], axis=1)
        
        # Find best matching chord
        best_chord = 'C'
        best_score = 0
        
        for chord_name, template in chord_templates.items():
            score = np.dot(segment_chroma, template)
            if score > best_score:
                best_score = score
                best_chord = chord_name
        
        detected_chords.append(best_chord)
    
    return detected_chords

def detect_key_from_chroma(chroma):
    """Enhanced key detection from chroma features."""
    # Key profiles (Krumhansl-Schmuckler)
    major_profile = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
    minor_profile = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
    
    # Average chroma across time
    avg_chroma = np.mean(chroma, axis=1)
    
    keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    best_key = 'C Major'
    best_score = 0
    
    # Test all major keys
    for i in range(12):
        shifted_profile = np.roll(major_profile, i)
        score = np.corrcoef(avg_chroma, shifted_profile)[0, 1]
        if score > best_score:
            best_score = score
            best_key = f"{keys[i]} Major"
    
    # Test all minor keys
    for i in range(12):
        shifted_profile = np.roll(minor_profile, i)
        score = np.corrcoef(avg_chroma, shifted_profile)[0, 1]
        if score > best_score:
            best_score = score
            best_key = f"{keys[i]} Minor"
    
    return best_key

def analyze_instruments(notes, audio, sr):
    """Analyze detected instruments based on note characteristics and audio features."""
    if not notes:
        return {
            "piano": {"detected": False, "confidence": 0.0, "notes": []},
            "guitar": {"detected": False, "confidence": 0.0, "chords": []},
            "drums": {"detected": False, "confidence": 0.0, "pattern": "None"}
        }
    
    # Separate notes by pitch range
    piano_notes = [n for n in notes if 21 <= n["pitch"] <= 108]  # Piano range
    guitar_notes = [n for n in notes if 40 <= n["pitch"] <= 83]  # Guitar range
    
    # Detect percussion using onset detection
    onset_frames = librosa.onset.onset_detect(y=audio, sr=sr, units='time')
    drums_detected = len(onset_frames) > 20
    
    # Calculate confidences based on note density and characteristics
    piano_confidence = min(len(piano_notes) / 50.0, 1.0) if piano_notes else 0.0
    guitar_confidence = min(len(guitar_notes) / 30.0, 1.0) if guitar_notes else 0.0
    drums_confidence = min(len(onset_frames) / 100.0, 1.0) if drums_detected else 0.0
    
    return {
        "piano": {
            "detected": len(piano_notes) > 5,
            "confidence": piano_confidence,
            "notes": piano_notes[:20]  # Limit for response size
        },
        "guitar": {
            "detected": len(guitar_notes) > 3,
            "confidence": guitar_confidence,
            "chords": detect_guitar_chords(guitar_notes)
        },
        "drums": {
            "detected": drums_detected,
            "confidence": drums_confidence,
            "pattern": "Detected rhythm pattern" if drums_detected else "No drums detected"
        }
    }

def detect_guitar_chords(guitar_notes):
    """Detect guitar chord patterns from notes."""
    if not guitar_notes:
        return []
    
    # Group notes by time windows to find chords
    chord_windows = []
    current_time = 0
    window_size = 1.0  # 1 second windows
    
    while current_time < max(n["time"] for n in guitar_notes):
        window_notes = [n for n in guitar_notes 
                       if current_time <= n["time"] < current_time + window_size]
        
        if len(window_notes) >= 2:  # At least 2 notes for a chord
            pitches = [n["pitch"] % 12 for n in window_notes]  # Convert to pitch classes
            chord_name = identify_chord_from_pitches(pitches)
            if chord_name:
                chord_windows.append(chord_name)
        
        current_time += window_size
    
    return chord_windows[:10]  # Limit for response size

def identify_chord_from_pitches(pitches):
    """Identify chord name from pitch classes."""
    # Simplified chord identification
    unique_pitches = list(set(pitches))
    if len(unique_pitches) < 2:
        return None
    
    # Common chord patterns (simplified)
    chord_patterns = {
        frozenset([0, 4, 7]): 'C',
        frozenset([0, 3, 7]): 'Cm',
        frozenset([2, 6, 9]): 'D',
        frozenset([2, 5, 9]): 'Dm',
        frozenset([4, 8, 11]): 'E',
        frozenset([4, 7, 11]): 'Em',
        frozenset([5, 9, 0]): 'F',
        frozenset([5, 8, 0]): 'Fm',
        frozenset([7, 11, 2]): 'G',
        frozenset([7, 10, 2]): 'Gm',
        frozenset([9, 1, 4]): 'A',
        frozenset([9, 0, 4]): 'Am',
    }
    
    pitch_set = frozenset(unique_pitches)
    return chord_patterns.get(pitch_set, f"Chord_{len(unique_pitches)}")

def calculate_transcription_confidence(notes):
    """Calculate overall transcription confidence based on note characteristics."""
    if not notes:
        return 0.0
    
    # Factors that indicate good transcription:
    # 1. Number of notes detected
    # 2. Note duration variety
    # 3. Pitch range coverage
    
    note_count_score = min(len(notes) / 100.0, 1.0)
    
    durations = [n["duration"] for n in notes]
    duration_variety = len(set([round(d, 1) for d in durations])) / 10.0
    duration_variety = min(duration_variety, 1.0)
    
    pitches = [n["pitch"] for n in notes]
    pitch_range = (max(pitches) - min(pitches)) / 88.0 if pitches else 0.0  # 88 piano keys
    pitch_range = min(pitch_range, 1.0)
    
    # Weighted average
    confidence = (note_count_score * 0.4 + duration_variety * 0.3 + pitch_range * 0.3)
    return round(confidence, 2)
