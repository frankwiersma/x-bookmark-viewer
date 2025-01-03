import React, { useState, useEffect, useCallback } from 'react';
import { X, Copy, Check, ChevronUp, ChevronDown } from 'lucide-react';

interface AIDialogProps {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  onQuestionChange: (value: string) => void;
  onAsk: () => void;
  answer: string | null;
  error: string | null;
  isLoading: boolean;
  isStreaming: boolean;
  isCopied: boolean;
  onCopy: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const useScrollPosition = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsCollapsed(scrollTop > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return isCollapsed;
};

const AIDialogContent = React.memo(function AIDialogContent({
  onClose,
  question,
  onQuestionChange,
  onAsk,
  answer,
  error,
  isLoading,
  isStreaming,
  isCopied,
  onCopy,
  onKeyDown,
}: Omit<AIDialogProps, 'isOpen'>) {
  const isCollapsed = useScrollPosition();
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);
  const shouldShow = !isCollapsed || isManuallyExpanded;

  return (
    <div className="relative z-30 mt-3 border border-[#2f3336] rounded-xl p-4 bg-black/95 animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Ask about your bookmarks</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#2f3336] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className={`space-y-4 transition-all duration-300 ease-out ${!shouldShow ? 'h-0 overflow-hidden opacity-0' : ''}`}>
        <textarea
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask anything about your bookmarks..."
          className="w-full bg-[#16181c] text-[#e7e9ea] rounded-xl p-3 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-[#1d9bf0]"
        />

        {answer && (
          <div className="p-4 bg-[#16181c] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#1d9bf0]">AI Response:</p>
              <button
                onClick={() => setIsManuallyExpanded(!isManuallyExpanded)}
                className="p-1 hover:bg-[#2f3336] rounded-full transition-colors mr-2"
              >
                {isManuallyExpanded ? 
                  <ChevronUp className="w-4 h-4 text-[#71767b]" /> : 
                  <ChevronDown className="w-4 h-4 text-[#71767b]" />
                }
              </button>
              <div className="flex items-center">
                <button
                  onClick={onCopy}
                  className="p-1 hover:bg-[#2f3336] rounded-full transition-colors"
                  title={isCopied ? 'Copied!' : 'Copy response'}
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#71767b]" />
                  )}
                </button>
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: answer }}
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-[#f4212e] text-sm">{error}</p>
        )}

        <button
          onClick={onAsk}
          disabled={isLoading || !question.trim()}
          className="w-full px-4 py-2 bg-[#1d9bf0] hover:bg-[#1a8cd8] disabled:opacity-50 disabled:hover:bg-[#1d9bf0] text-white rounded-full transition-colors"
        >
          {isStreaming ? 'Generating...' : isLoading ? 'Thinking...' : shouldShow ? 'Ask AI' : 'Show Response'}
        </button>
      </div>
    </div>
  );
});

export const AIDialog = React.memo(function AIDialog(props: AIDialogProps) {
  if (!props.isOpen) return null;
  return <AIDialogContent {...props} />;
});