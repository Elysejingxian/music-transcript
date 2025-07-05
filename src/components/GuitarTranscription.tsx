import React from 'react';

interface GuitarTranscriptionProps {
  songInfo: {
    title: string;
    key: string;
    tempo: number;
    timeSignature: string;
  };
}

const GuitarTranscription: React.FC<GuitarTranscriptionProps> = ({ songInfo }) => {
  const sampleTab = `
E|--0--2--3--2--0--2--3--5--|
B|--1--3--0--3--1--3--0--3--|
G|--0--2--0--2--0--2--0--4--|
D|--2--0--2--0--2--0--2--5--|
A|--3--x--3--x--3--x--3--3--|
E|--x--x--x--x--x--x--x--x--|
   C  D  Em D  C  D  Em G

E|--0--0--0--0--2--2--2--2--|
B|--1--1--1--1--3--3--3--3--|
G|--0--0--0--0--2--2--2--2--|
D|--2--2--2--2--0--0--0--0--|
A|--3--3--3--3--x--x--x--x--|
E|--x--x--x--x--x--x--x--x--|
   C           D
  `;

  const chordProgression = [
    { name: 'C', frets: 'x32010', finger: '032010' },
    { name: 'D', frets: 'xx0232', finger: '000132' },
    { name: 'Em', frets: '022000', finger: '023000' },
    { name: 'G', frets: '320003', finger: '210003' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Guitar Transcription</h3>
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

      {/* Chord Chart */}
      <div className="notation-container mb-6">
        <h4 className="font-semibold text-gray-800 mb-4">Chord Chart</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {chordProgression.map((chord, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="font-bold text-lg mb-2">{chord.name}</div>
              <div className="font-mono text-sm mb-1">{chord.frets}</div>
              <div className="font-mono text-xs text-gray-600">({chord.finger})</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tablature */}
      <div className="notation-container mb-6">
        <h4 className="font-semibold text-gray-800 mb-4">Guitar Tablature</h4>
        <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
          <pre className="tab-line text-sm">{sampleTab}</pre>
        </div>
      </div>

      {/* Strumming Pattern */}
      <div className="notation-container mb-6">
        <h4 className="font-semibold text-gray-800 mb-4">Strumming Pattern</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="font-mono text-lg mb-2">D - D U - U D U</div>
          <div className="text-sm text-gray-600 mb-4">
            D = Down strum, U = Up strum, - = Rest
          </div>
          <div className="text-sm">
            <strong>Count:</strong> 1 e + a 2 e + a 3 e + a 4 e + a
          </div>
        </div>
      </div>

      {/* Song Structure */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Song Structure</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Intro:</span>
            <span>C - D - Em - G (x2)</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Verse:</span>
            <span>C - D - Em - G (x4)</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Chorus:</span>
            <span>Em - C - G - D (x4)</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Bridge:</span>
            <span>Am - F - C - G (x2)</span>
          </div>
        </div>
      </div>

      {/* Playing Techniques */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-3">Playing Techniques</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-blue-800">Fingerpicking Pattern:</div>
            <div className="text-blue-700">T-1-2-3-2-1 (Thumb-Index-Middle-Ring-Middle-Index)</div>
          </div>
          <div>
            <div className="font-medium text-blue-800">Capo Position:</div>
            <div className="text-blue-700">No capo required for this key</div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">AI Transcription Note</h4>
        <p className="text-yellow-700 text-sm">
          This is a demo transcription showing typical guitar notation formats. Real audio analysis 
          would require specialized algorithms to detect chord progressions, fingering patterns, 
          and playing techniques from the audio signal.
        </p>
      </div>
    </div>
  );
};

export default GuitarTranscription;
