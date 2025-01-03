import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAIStore } from '../store/aiStore';

interface APIKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function APIKeyDialog({ isOpen, onClose }: APIKeyDialogProps) {
  const { setCustomApiKey } = useAIStore();
  const [apiKey, setApiKey] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setCustomApiKey(apiKey.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-black border border-[#2f3336] rounded-xl p-6 max-w-md w-full animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Add Your Gemini API Key</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#2f3336] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6 p-3 bg-[#16181c] rounded-xl text-sm text-[#71767b]">
          <p className="mb-2">
            <strong className="text-[#e7e9ea]">🔒 Privacy Notice:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Your API key is stored locally in your browser only</li>
            <li>It never leaves your device or gets sent to any server</li>
            <li>You can remove it anytime by clearing your browser data</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#71767b] mb-2">
              Get your API key from{' '}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1d9bf0] hover:underline"
              >
                Google AI Studio
              </a>
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="w-full bg-[#16181c] text-[#e7e9ea] rounded-xl p-3 border border-[#2f3336] focus:outline-none focus:ring-1 focus:ring-[#1d9bf0]"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#e7e9ea] hover:bg-[#2f3336] rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!apiKey.trim()}
              className="px-4 py-2 bg-[#1d9bf0] hover:bg-[#1a8cd8] disabled:opacity-50 text-white rounded-full transition-colors"
            >
              Save API Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}