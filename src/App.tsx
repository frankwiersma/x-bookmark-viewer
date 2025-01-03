import React, { useCallback, useEffect, useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { BookmarksFeed } from './components/BookmarksFeed';
import { Header } from './components/Header';
import { Controls } from './components/Controls'; 
import { useBookmarksStore } from './store/bookmarksStore';
import { initGemini } from './utils/gemini';
import { saveBookmarksToStorage, loadBookmarksFromStorage } from './utils/storage';
import { validateFile, validateBookmarksData, FileValidationError } from './utils/fileValidation';

function App() {
  const { bookmarks, setBookmarks, layout } = useBookmarksStore();
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // Auto-hide success messages after 3 seconds
  useEffect(() => {
    if (uploadMessage?.type === 'success') {
      const timer = setTimeout(() => {
        setUploadMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadMessage]);

  useEffect(() => {
    initGemini();
    
    // Load bookmarks from storage on initial mount
    const stored = loadBookmarksFromStorage();
    if (stored) {
      setBookmarks(stored);
    }
  }, [setBookmarks]);

  // Save bookmarks to storage whenever they change
  useEffect(() => {
    if (bookmarks.length > 0) {
      saveBookmarksToStorage(bookmarks);
    }
  }, [bookmarks]);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    
    try {
      validateFile(file);
    } catch (err) {
      if (err instanceof FileValidationError) {
        setUploadMessage({ type: 'info', text: err.message });
      }
      return;
    }
    
    const parseBookmark = (data: any) => {
      // Handle the alternative format
      if (data.author && data.link) {
        setUploadMessage({
          type: 'info',
          text: 'Detected Twitter Bookmark Exporter Chrome extension format. For a complete export with media support, we recommend using Surfer Protocol.'
        });
        const [username] = data.author.split('·')[0].split('@').slice(-1);
        return {
          id: data.id,
          text: data.text,
          timestamp: data.timestamp,
          username: username.trim(),
          media: null, // Media not supported in this format
        };
      }
      // Return original format as is
      return data;
    };

    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        validateBookmarksData(json);
        
        // Handle array of bookmarks directly
        if (Array.isArray(json)) {
          const bookmarks = json.map(parseBookmark);
          setBookmarks(bookmarks);
          if (!bookmarks[0]?.author) {
            setUploadMessage({ type: 'success', text: 'Bookmarks loaded successfully' });
          }
          return;
        }
        // Handle original format with content property
        if (json.content && Array.isArray(json.content)) {
          const bookmarks = json.content.map(parseBookmark);
          setBookmarks(bookmarks);
          if (!bookmarks[0]?.author) {
            setUploadMessage({ type: 'success', text: 'Bookmarks loaded successfully' });
          }
          return;
        }
      } catch (err) {
        const message = err instanceof FileValidationError
          ? err.message
          : 'Failed to parse JSON file. Please check the file format.';
        setUploadMessage({ type: 'info', text: message });
        console.error('File processing error:', err);
      }
    };

    reader.onerror = () => {
      setUploadMessage({ 
        type: 'info', 
        text: 'Error reading file. Please try again.' 
      });
    };

    reader.readAsText(file);
  }, [setBookmarks, setUploadMessage]);

  return (
    <div className="min-h-screen bg-black text-[#e7e9ea]">
      <Header />
      
      <main className={`mx-auto px-4 py-4 ${bookmarks.length === 0 || layout === 'list' ? 'max-w-2xl' : 'max-w-7xl'}`}>
        {uploadMessage && (
          <div className={`mb-4 p-4 rounded-xl transition-all duration-300 ease-out ${
            uploadMessage.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-[#1d9bf0]/10 text-[#1d9bf0]'
          } ${uploadMessage.type === 'success' ? 'animate-fade-out' : ''}`}>
            {uploadMessage.text}
          </div>
        )}
        {bookmarks.length === 0 ? (
          <FileUpload onFileUpload={handleFileUpload} />
        ) : (
          <div className="space-y-4"> 
            <Controls />
            <BookmarksFeed />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;