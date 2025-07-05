import React, { useState } from 'react';
import { Upload, Play, Pause, Download, Music, Music2, Drum } from 'lucide-react';
import AudioUploader from './components/AudioUploader';
import AudioPlayer from './components/AudioPlayer';
import PianoTranscription from './components/PianoTranscription';
import GuitarTranscription from './components/GuitarTranscription';
import DrumTranscription from './components/DrumTranscription';

function App() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'piano' | 'guitar' | 'drums'>('piano');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleFileUpload = (file: File) => {
    setAudioFile(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    
    // Simulate transcription process
    setIsTranscribing(true);
    setTimeout(() => {
      setIsTranscribing(false);
    }, 3000);
  };

  const songInfo = {
    title: audioFile?.name.replace(/\.[^/.]+$/, "") || "Untitled Song",
    key: "C Major",
    tempo: 120,
    timeSignature: "4/4"
  };

  const tabs = [
    { id: 'piano', label: 'Piano', icon: Music },
    { id: 'guitar', label: 'Guitar', icon: Music2 },
    { id: 'drums', label: 'Drums', icon: Drum }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Music Transcription Studio</h1>
          <p className="text-gray-600">Upload your audio and get instant sheet music, tabs, and drum notation</p>
        </div>

        {/* Audio Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <AudioUploader onFileUpload={handleFileUpload} />
          
          {audioUrl && (
            <div className="mt-6">
              <AudioPlayer audioUrl={audioUrl} />
            </div>
          )}
        </div>

        {/* Transcription Status */}
        {isTranscribing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-800 font-medium">Analyzing audio and generating transcription...</span>
            </div>
          </div>
        )}

        {/* Transcription Results */}
        {audioFile && !isTranscribing && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'piano' | 'guitar' | 'drums')}
                      className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'piano' && <PianoTranscription songInfo={songInfo} />}
              {activeTab === 'guitar' && <GuitarTranscription songInfo={songInfo} />}
              {activeTab === 'drums' && <DrumTranscription songInfo={songInfo} />}
            </div>

            {/* Export Options */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </button>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Export MIDI
                </button>
                <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Export MusicXML
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">1. Upload Audio</h3>
              <p className="text-gray-600 text-sm">Upload your audio file in MP3, WAV, or other supported formats</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">2. AI Analysis</h3>
              <p className="text-gray-600 text-sm">Our AI analyzes the audio to detect notes, chords, and rhythms</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">3. Get Transcription</h3>
              <p className="text-gray-600 text-sm">Download professional sheet music, tabs, and notation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
