import React, { useEffect, useRef } from 'react';

interface PianoTranscriptionProps {
  songInfo: {
    title: string;
    key: string;
    tempo: number;
    timeSignature: string;
  };
}

const PianoTranscription: React.FC<PianoTranscriptionProps> = ({ songInfo }) => {
  const notationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // VexFlow integration would go here
    // For now, we'll show a placeholder
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Piano Sheet Music</h3>
          <p className="text-gray-600">Key: {songInfo.key} | Tempo: {songInfo.tempo} BPM | Time: {songInfo.timeSignature}</p>
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
            <p className="text-gray-600">AI-generated piano transcription would appear here</p>
            <div className="mt-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-mono text-lg mb-2">Sample Chord Progression:</div>
                <div className="space-y-1">
                  <div>C Major - F Major - G Major - C Major</div>
                  <div>Am - F - C - G</div>
                  <div>Dm - G - Em - Am</div>
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
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="bg-white border rounded flex flex-col">
              <div className="flex-1 bg-gradient-to-t from-blue-200 to-transparent opacity-60"></div>
              <div className="text-xs text-center p-1">
                {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-3">Detected Elements</h4>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Key Signature: {songInfo.key}</li>
            <li>• Time Signature: {songInfo.timeSignature}</li>
            <li>• Tempo: {songInfo.tempo} BPM</li>
            <li>• Chord Progressions: I-IV-V-I pattern detected</li>
            <li>• Melody Range: C4 to G5</li>
          </ul>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-3">Performance Notes</h4>
          <ul className="space-y-2 text-sm text-green-700">
            <li>• Suggested fingering patterns included</li>
            <li>• Pedal markings for sustained passages</li>
            <li>• Dynamic markings (forte, piano, crescendo)</li>
            <li>• Articulation marks (staccato, legato)</li>
            <li>• Recommended practice tempo: 80 BPM</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">AI Transcription Note</h4>
        <p className="text-yellow-700 text-sm">
          This is a demo showing the piano transcription interface. Real audio analysis would require 
          advanced signal processing to detect notes, timing, and musical structure from the audio file.
        </p>
      </div>
    </div>
  );
};

export default PianoTranscription;
