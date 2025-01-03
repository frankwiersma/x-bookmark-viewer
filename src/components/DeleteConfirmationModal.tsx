import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-black border border-[#2f3336] rounded-xl p-6 max-w-md w-full animate-scale-in">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#2f3336]/50 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-[#f4212e]" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Delete Bookmarks</h2>
            <p className="text-[#71767b]">From this viewer only</p>
          </div>
        </div>
        
        <p className="mb-6 text-[#e7e9ea]">
          This will only remove the bookmarks from this viewer. Your bookmarks on X.com will remain unchanged. Do you want to continue?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-[#e7e9ea] hover:bg-[#2f3336] rounded-full transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#f4212e] hover:bg-[#dc1d27] text-white rounded-full transition-colors"
          >
            Remove from Viewer
          </button>
        </div>
      </div>
    </div>
  );
}