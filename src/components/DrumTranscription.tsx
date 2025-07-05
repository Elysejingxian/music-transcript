import React from 'react';

interface DrumTranscriptionProps {
  songInfo: {
    title: string;
    key: string;
    tempo: number;
    timeSignature: string;
  };
}

const DrumTranscription: React.FC<DrumTranscriptionProps> = ({ songInfo }) => {
  const drumPattern = `
HH |x-x-x-x-x-x-x-x-|x-x-x-x-x-x-x-x-|
SD |----o-------o---|----o-------o---|
BD |o-------o-------|o-------o-------|
   |1 e + a 2 e + a |3 e + a 4 e + a |
  `;

  const drumKit = [
    { name: 'Hi-Hat', symbol: 'HH', sound: 'Closed/Open hi-hat' },
    { name: 'Snare', symbol: 'SD', sound: 'Snare drum' },
    { name: 'Bass Drum', symbol: 'BD', sound: 'Kick drum' },
    { name: 'Crash', symbol: 'CC', sound: 'Crash cymbal' },
    { name: 'Ride', symbol: 'RD', sound: 'Ride cymbal' },
    { name: 'Tom', symbol: 'TT', sound: 'Tom-tom' },
  ];

  return (
    <div id="drum-transcription">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Drum Transcription</h3>
          <p className="text-gray-600">Tempo: {songInfo.tempo} BPM | Time: {songInfo.timeSignature}</p>
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

      {/* Drum Kit Legend */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-800 mb-4">Drum Kit Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {drumKit.map((drum, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="bg-white border rounded px-2 py-1 font-mono text-sm font-bold">
                {drum.symbol}
              </div>
              <div>
                <div className="font-medium text-sm">{drum.name}</div>
                <div className="text-xs text-gray-600">{drum.sound}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drum Notation */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-gray-800 mb-4">Drum Pattern</h4>
        <div className="overflow-x-auto">
          <pre className="font-mono text-sm leading-relaxed">{drumPattern}</pre>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <strong>Notation Key:</strong>
              <ul className="mt-2 space-y-1">
                <li>x = Hit</li>
                <li>o = Accent/Open</li>
                <li>- = Rest</li>
              </ul>
            </div>
            <div>
              <strong>Timing:</strong>
              <ul className="mt-2 space-y-1">
                <li>1, 2, 3, 4 = Downbeats</li>
                <li>e, +, a = Subdivisions</li>
                <li>Each measure = 4 beats</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Groove Analysis */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-3">Groove Analysis</h4>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex justify-between">
              <span>Style:</span>
              <span className="font-medium">Rock/Pop</span>
            </div>
            <div className="flex justify-between">
              <span>Feel:</span>
              <span className="font-medium">Straight 8th notes</span>
            </div>
            <div className="flex justify-between">
              <span>Complexity:</span>
              <span className="font-medium">Intermediate</span>
            </div>
            <div className="flex justify-between">
              <span>Fills:</span>
              <span className="font-medium">Every 8 bars</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-3">Practice Tips</h4>
          <ul className="space-y-2 text-sm text-green-700">
            <li>• Start slow at 60-80 BPM</li>
            <li>• Focus on hi-hat consistency</li>
            <li>• Keep snare on beats 2 and 4</li>
            <li>• Practice limb independence</li>
            <li>• Use metronome for timing</li>
          </ul>
        </div>
      </div>

      {/* Song Structure */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Song Structure</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Intro:</span>
            <span>4 bars - Simple kick/snare pattern</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Verse:</span>
            <span>16 bars - Main groove with hi-hat</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Chorus:</span>
            <span>8 bars - Open hi-hat, crash accents</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Bridge:</span>
            <span>8 bars - Tom fills, ride cymbal</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Outro:</span>
            <span>4 bars - Crash finale</span>
          </div>
        </div>
      </div>

      {/* Dynamic Markings */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-purple-800 mb-3">Dynamic Markings</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-purple-800 mb-2">Volume Levels:</div>
            <ul className="space-y-1 text-purple-700">
              <li>• Verse: mp (medium soft)</li>
              <li>• Chorus: f (forte/loud)</li>
              <li>• Bridge: mf (medium loud)</li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-purple-800 mb-2">Accents:</div>
            <ul className="space-y-1 text-purple-700">
              <li>• Crash on beat 1 of chorus</li>
              <li>• Snare accents on off-beats</li>
              <li>• Ghost notes between main hits</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">AI Transcription Note</h4>
        <p className="text-yellow-700 text-sm">
          This is a demo drum transcription showing standard notation formats. Real audio analysis 
          would use onset detection and spectral analysis to identify drum hits, their timing, 
          and which drum kit pieces are being played.
        </p>
      </div>
    </div>
  );
};

export default DrumTranscription;
