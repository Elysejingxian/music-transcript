import React, { useCallback } from 'react';
import { Upload, Music } from 'lucide-react';

interface AudioUploaderProps {
  onFileUpload: (file: File) => void;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileUpload }) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('audio/')) {
        onFileUpload(file);
      }
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
    >
      <div className="flex flex-col items-center">
        <div className="bg-blue-100 rounded-full p-4 mb-4">
          <Upload className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Your Audio File</h3>
        <p className="text-gray-600 mb-4">Drag and drop your audio file here, or click to browse</p>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          className="hidden"
          id="audio-upload"
        />
        <label
          htmlFor="audio-upload"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
        >
          Choose File
        </label>
        <p className="text-sm text-gray-500 mt-2">Supports MP3, WAV, FLAC, and more</p>
      </div>
    </div>
  );
};

export default AudioUploader;
