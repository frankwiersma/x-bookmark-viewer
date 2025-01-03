import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useBookmarksStore } from '../store/bookmarksStore';
import { askAboutBookmarks } from '../utils/gemini';

export function AskAIButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { bookmarks } = useBookmarksStore();

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await askAboutBookmarks(question, bookmarks);
      setAnswer(response);
    } catch (err) {
      setError('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-full transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        <span>Ask AI</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-black border border-[#2f3336] rounded-xl p-4 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Ask about your bookmarks</h2>
            
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about your bookmarks..."
              className="w-full bg-[#16181c] text-[#e7e9ea] rounded-xl p-3 mb-4 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-[#1d9bf0]"
            />

            {answer && (
              <div className="mb-4 p-3 bg-[#16181c] rounded-xl">
                <p className="text-sm text-[#1d9bf0] mb-1">AI Response:</p>
                <p className="whitespace-pre-wrap">{answer}</p>
              </div>
            )}

            {error && (
              <p className="text-[#f4212e] text-sm mb-4">{error}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-[#e7e9ea] hover:bg-[#2f3336] rounded-full transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleAsk}
                disabled={isLoading || !question.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-[#1d9bf0] hover:bg-[#1a8cd8] disabled:opacity-50 disabled:hover:bg-[#1d9bf0] text-white rounded-full transition-colors"
              >
                {isLoading ? 'Thinking...' : 'Ask'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}