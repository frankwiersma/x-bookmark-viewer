import React, { useState } from 'react';
import { MessageSquare, LayoutGrid, LayoutList, Layout } from 'lucide-react';
import { useBookmarksStore } from '../store/bookmarksStore';
import { askAboutBookmarks } from '../utils/gemini';
import { AIDialog } from './AIDialog';
import { ClearDataPopover } from './ClearDataPopover';
import { APIKeyDialog } from './APIKeyDialog';
import { useAIStore } from '../store/aiStore';

export function Header() {
  const { bookmarks, layout, setLayout, setBookmarks } = useBookmarksStore();
  const { queryCount, customApiKey } = useAIStore();
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAPIKeyDialogOpen, setIsAPIKeyDialogOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleCopy = async () => {
    if (!answer) return;
    try {
      await navigator.clipboard.writeText(answer.replace(/<[^>]+>/g, ''));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setIsLoading(true);
    setIsStreaming(true);
    setError(null);
    setAnswer('');
    
    try {
      await askAboutBookmarks(
        question,
        bookmarks,
        (chunk) => setAnswer(chunk)
      );
    } catch (err) {
      setError('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleClose = () => {
    setIsAIOpen(false);
    setQuestion('');
    setAnswer(null);
    setIsStreaming(false);
    setError(null);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-[#2f3336]">
      <div className={`mx-auto px-4 py-3 ${layout === 'grid' ? 'max-w-7xl' : 'max-w-2xl'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-8 h-8 text-[#e7e9ea]">
              <path
                fill="currentColor"
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              />
            </svg>
            <h1 className="text-xl font-bold">Bookmarks Viewer</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-[#16181c] rounded-full p-1 mr-2">
              <button
                onClick={() => setLayout('list')}
                className={`p-2 rounded-full transition-colors ${
                  layout === 'list' ? 'bg-[#2f3336]' : 'hover:bg-[#2f3336]/50'
                }`}
                title="List view"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout('grid')}
                className={`p-2 rounded-full transition-colors ${
                  layout === 'grid' ? 'bg-[#2f3336]' : 'hover:bg-[#2f3336]/50'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout('compact')}
                className={`p-2 rounded-full transition-colors ${
                  layout === 'compact' ? 'bg-[#2f3336]' : 'hover:bg-[#2f3336]/50'
                }`}
                title="Compact view"
              >
                <Layout className="w-4 h-4" />
              </button>
            </div>
            <ClearDataPopover onClear={() => setBookmarks([])} />
            <button
              onClick={() => {
                if (!customApiKey && queryCount >= 2) {
                  setIsAPIKeyDialogOpen(true);
                } else {
                  setIsAIOpen(!isAIOpen);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-full transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>
                {!customApiKey && queryCount >= 2 ? 'Add API Key' : 'Ask AI'}
                {!customApiKey && queryCount < 2 && ` (${2 - queryCount} left)`}
              </span>
            </button>
          </div>
        </div>
        <AIDialog
          isOpen={isAIOpen}
          onClose={handleClose}
          question={question}
          onQuestionChange={setQuestion}
          onAsk={handleAsk}
          answer={answer}
          error={error}
          isLoading={isLoading}
          isStreaming={isStreaming}
          isCopied={isCopied}
          onCopy={handleCopy}
          onKeyDown={handleKeyPress}
        />
        <APIKeyDialog
          isOpen={isAPIKeyDialogOpen}
          onClose={() => setIsAPIKeyDialogOpen(false)}
        />
      </div>
    </header>
  );
}