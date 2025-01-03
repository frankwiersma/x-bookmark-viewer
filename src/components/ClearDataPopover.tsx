import React, { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { clearBookmarksFromStorage } from '../utils/storage';

interface ClearDataPopoverProps {
  onClear: () => void;
}

export function ClearDataPopover({ onClear }: ClearDataPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    clearBookmarksFromStorage();
    onClear();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-[#71767b] hover:text-[#f4212e] transition-colors rounded-full hover:bg-[#2f3336]"
        title="Clear all bookmarks"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute right-0 top-full mt-2 w-72 p-4 bg-black border border-[#2f3336] rounded-xl shadow-lg animate-scale-in z-50"
        >
          <p className="text-[#e7e9ea] mb-3">
            This will only remove the bookmarks from this viewer. Your bookmarks on X.com will remain unchanged.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 text-[#e7e9ea] hover:bg-[#2f3336] rounded-full text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 bg-[#f4212e] hover:bg-[#dc1d27] text-white rounded-full text-sm transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}