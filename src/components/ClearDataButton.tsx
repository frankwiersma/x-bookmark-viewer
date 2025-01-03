import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { clearBookmarksFromStorage } from '../utils/storage';
import { useBookmarksStore } from '../store/bookmarksStore';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

export function ClearDataButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setBookmarks } = useBookmarksStore();

  const handleClear = () => {
    clearBookmarksFromStorage();
    setBookmarks([]);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 text-[#71767b] hover:text-[#f4212e] transition-colors rounded-full hover:bg-[#2f3336]/20"
        title="Clear all bookmarks"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleClear}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
}