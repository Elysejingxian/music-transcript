const API_BASE_URL = 'http://localhost:8000';

export interface TranscriptionResponse {
  file_id: string;
  filename: string;
  midi_url: string;
  analysis: {
    tempo: number;
    key: string;
    time_signature: string;
    duration: number;
    notes: Array<{
      pitch: number;
      time: number;
      duration: number;
      velocity: number;
    }>;
    chord_progression: string[];
    instruments: {
      piano: {
        detected: boolean;
        confidence: number;
        notes: any[];
      };
      guitar: {
        detected: boolean;
        confidence: number;
        chords: string[];
      };
      drums: {
        detected: boolean;
        confidence: number;
        pattern: string;
      };
    };
  };
}

export const transcribeAudio = async (file: File): Promise<TranscriptionResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/transcribe/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Transcription failed: ${response.statusText}`);
  }

  return response.json();
};

export const downloadMIDI = async (fileId: string): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/download/midi/${fileId}`);
  
  if (!response.ok) {
    throw new Error(`MIDI download failed: ${response.statusText}`);
  }

  return response.blob();
};

export const getAnalysis = async (fileId: string) => {
  const response = await fetch(`${API_BASE_URL}/analysis/${fileId}`);
  
  if (!response.ok) {
    throw new Error(`Analysis fetch failed: ${response.statusText}`);
  }

  return response.json();
};
