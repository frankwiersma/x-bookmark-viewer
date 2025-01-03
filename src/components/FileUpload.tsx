import React, { useCallback } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type === 'application/json') {
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const recommendedExport = (
    <div className="mt-6 p-4 bg-[#16181c] rounded-xl">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#1d9bf0] flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold mb-2">Recommended Export Option</h3>
          <p className="text-[#71767b] text-sm mb-2">
            For a complete bookmarks export with media support, we recommend using Surfer:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 text-[#71767b]">
            <li>
              <a 
                href="https://github.com/Surfer-Org/Protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1d9bf0] hover:underline"
              >
                Surfer Protocol
              </a>
            </li>
            <li>
              <a
                href="https://docs.surferprotocol.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1d9bf0] hover:underline"
              >
                Documentation
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-[#2f3336] rounded-xl p-8"
    >
      <div className="text-center">
        <Upload className="w-12 h-12 mx-auto mb-4 text-[#1d9bf0]" />
        <h2 className="text-xl font-bold mb-2">Upload your bookmarks</h2>
        <p className="text-[#71767b] mb-4">
          Drag and drop your bookmarks.json file here, or click below to select
        </p>
        <label className="inline-block">
          <input
            type="file"
            accept="application/json"
            onChange={handleFileInput}
            className="hidden"
          />
          <span className="bg-[#1d9bf0] text-white px-4 py-2 rounded-full font-bold cursor-pointer hover:bg-[#1a8cd8] transition-colors">
            Choose File
          </span>
        </label>
      </div>
      {recommendedExport}
    </div>
  );
}