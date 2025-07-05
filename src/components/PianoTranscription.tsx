import React, { useEffect, useRef } from 'react';
import { TranscriptionResponse } from '../services/api';

interface PianoTranscriptionProps {
  songInfo: {
    title: string;
    key: string;
    tempo: number;
    timeSignature: string;
  };
  transcriptionData?: TranscriptionResponse | null;
}

const PianoTranscription: React.FC<PianoTranscriptionProps> = ({ songInfo, transcriptionData }) => {
  const notationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // VexFlow integration would go here
    // For now, we'll show a placeholder
  }, []);

  const pianoData = transcriptionData?.analysis.instruments.piano;
  const notes = transcriptionData?.analysis.notes || [];
  const isBasicPitch = transcriptionData?.analysis.transcription_method?.includes('basic-pitch');

  return (
    <div id="piano-transcription">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Piano Sheet Music</h3>
          <p className="text-gray-600">Key: {songInfo.key} | Tempo: {songInfo.tempo} BPM | Time: {songInfo.timeSignature}</p>
          {pianoData && (
            <div className="flex items-center gap-4 mt-2">
              <p className="text-sm text-blue-600">
                Detection Confidence: {Math.round(pianoData.confidence * 100)}% | 
                Notes Detected: {notes.length}
              </p>
              {isBasicPitch && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  🤖 AI-Powered
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Play
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Edit
          </button>
        </div>
      </div>

      {/* Sheet Music Display */}
      <div className="bg-white border rounded-lg p-6 mb-6" style={{ minHeight: '400px' }}>
        <div ref={notationRef} className="w-full h-full flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">🎼</div>
            <h4 className="text-xl font-semibold mb-2">Piano Sheet Music</h4>
            {transcriptionData ? (
              <div>
                <p className="text-gray-600 mb-4">
                  {isBasicPitch ? 'AI-generated piano transcription using basic-pitch model' : 'AI-generated piano transcription from your audio'}
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="text-green-800 font-medium">
                    {isBasicPitch ? '🤖 Basic-Pitch AI Transcription Complete!' : 'Transcription Complete!'}
                  </div>
                  <div className="text-green-700 text-sm">
                    Detected {notes.length} notes with {Math.round((transcriptionData.analysis.model_confidence || pianoData?.confidence || 0) * 100)}% overall confidence
                  </div>
                  {transcriptionData.analysis.transcription_method && (
                    <div className="text-green-600 text-xs mt-1">
                      Method: {transcriptionData.analysis.transcription_method}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">AI-generated piano transcription would appear here</p>
            )}
            <div className="mt-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-mono text-lg mb-2">
                  {transcriptionData ? 'AI-Detected Chord Progression:' : 'Sample Chord Progression:'}
                </div>
                <div className="space-y-1">
                  {transcriptionData?.analysis.chord_progression ? (
                    <div className="flex flex-wrap gap-2">
                      {transcriptionData.analysis.chord_progression.map((chord, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {chord}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div>C Major - F Major - G Major - C Major</div>
                      <div>Am - F - C - G</div>
                      <div>Dm - G - Em - Am</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Piano Roll Visualization */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-800 mb-4">Piano Roll View</h4>
        <div className="grid grid-cols-12 gap-1 h-32">
          {Array.from({ length: 12 }, (_, i) => {
            const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            const hasNote = notes.some(note => Math.floor(note.pitch) % 12 === i);
            const noteCount = notes.filter(note => Math.floor(note.pitch) % 12 === i).length;
            
            return (
              <div key={i} className="bg-white border rounded flex flex-col">
                <div className={`flex-1 ${hasNote ? 'bg-gradient-to-t from-blue-400 to-blue-200' : 'bg-gradient-to-t from-blue-100 to-transparent opacity-30'}`}>
                  {hasNote && (
                    <div className="text-xs text-center text-white font-bold pt-1">
                      {noteCount}
                    </div>
                  )}
                </div>
                <div className="text-xs text-center p-1">
                  {noteNames[i]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analysis Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-3">AI Analysis Results</h4>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Key Signature: {songInfo.key}</li>
            <li>• Time Signature: {songInfo.timeSignature}</li>
            <li>• Tempo: {songInfo.tempo} BPM</li>
            {transcriptionData && (
              <>
                <li>• Duration: {Math.round(transcriptionData.analysis.duration)}s</li>
                <li>• Notes Detected: {notes.length}</li>
                <li>• Chord Progressions: {transcriptionData.analysis.chord_progression.length} chords</li>
                <li>• Model Confidence: {Math.round((transcriptionData.analysis.model_confidence || 0) * 100)}%</li>
                {isBasicPitch && <li>• AI Model: Basic-Pitch ICASSP 2022</li>}
              </>
            )}
          </ul>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-3">Performance Notes</h4>
          <ul className="space-y-2 text-sm text-green-700">
            <li>• AI-generated fingering suggestions</li>
            <li>• Pedal markings for sustained passages</li>
            <li>• Dynamic markings (forte, piano, crescendo)</li>
            <li>• Articulation marks (staccato, legato)</li>
            <li>• Recommended practice tempo: {Math.round(songInfo.tempo * 0.7)} BPM</li>
            {isBasicPitch && <li>• Professional-grade AI transcription</li>}
          </ul>
        </div>
      </div>

      {transcriptionData ? (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">
            {isBasicPitch ? '🤖 Basic-Pitch AI Transcription Complete' : 'AI Transcription Complete'}
          </h4>
          <p className="text-green-700 text-sm">
            Successfully analyzed your audio file using {transcriptionData.analysis.transcription_method || 'AI transcription'} 
            and generated piano transcription with {Math.round((transcriptionData.analysis.model_confidence || pianoData?.confidence || 0) * 100)}% confidence. 
            The transcription includes {notes.length} detected notes and {transcriptionData.analysis.chord_progression.length} chord progressions.
          </p>
          {transcriptionData.analysis.error && (
            <p className="text-red-600 text-sm mt-2">
              Note: {transcriptionData.analysis.error}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">AI Transcription Note</h4>
          <p className="text-yellow-700 text-sm">
            This is a demo showing the piano transcription interface. Upload an audio file to see real AI-powered transcription results using the basic-pitch model.
          </p>
        </div>
      )}
    </div>
  );
};

export default PianoTranscription;
