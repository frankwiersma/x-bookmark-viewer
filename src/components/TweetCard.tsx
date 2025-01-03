import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Tweet, Layout } from '../types';
import { summarizeTweet } from '../utils/gemini';

interface TweetCardProps {
  tweet: Tweet;
  layout: Layout;
}

export function TweetCard({ tweet, layout }: TweetCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cleanText] = useState(() => {
    // Remove t.co URLs from tweet text
    return tweet.text.replace(/https:\/\/t\.co\/\w+/g, '').trim();
  });

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleSummarize = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await summarizeTweet(tweet.text);
      setSummary(result);
    } catch (err) {
      setError('Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  const layoutClasses = {
    list: {
      container: 'p-4',
      text: 'text-base',
      avatar: 'w-10 h-10'
    },
    grid: {
      container: 'p-3',
      text: 'text-base',
      avatar: 'w-10 h-10'
    },
    compact: {
      container: 'p-2',
      text: 'text-sm',
      avatar: 'w-8 h-8'
    }
  };

  return (
    <article 
      onClick={() => window.open(`https://x.com/${tweet.username}/status/${tweet.id.replace('tweet-', '')}`, '_blank')}
      className={`group relative border border-[#2f3336] rounded-xl hover:bg-[#16181c] transition-all duration-300 ease-out cursor-pointer ${layoutClasses[layout].container}`}
    >
      <div className="flex items-start gap-3 mb-2">
        <div className={`rounded-full bg-[#2f3336] flex-shrink-0 ${layoutClasses[layout].avatar}`} />
        <div className="flex-1">
          <button 
            href={`https://x.com/${tweet.username}`}
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://x.com/${tweet.username}`, '_blank');
            }}
            className="text-[#e7e9ea] hover:underline z-10 relative text-left"
          >
            @{tweet.username}
          </button>
        </div>
        <button
          disabled={isLoading}
          className="text-[#1d9bf0] hover:text-[#1a8cd8] disabled:opacity-50 z-10 relative"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSummarize();
          }}
          title="Get AI summary"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      <p className={`whitespace-pre-wrap mb-3 ${layoutClasses[layout].text}`}>{cleanText}</p>

      {summary && (
        <div className="mb-3 p-3 bg-[#16181c] rounded-lg">
          <p className="text-sm text-[#1d9bf0] mb-1">AI Summary:</p>
          <p className="text-sm">{summary}</p>
        </div>
      )}

      {error && (
        <p className="text-[#f4212e] text-sm mb-3">{error}</p>
      )}

      {tweet.media && (
        <div className={`rounded-xl overflow-hidden mb-3 transition-all duration-300 ease-out ${layout === 'compact' ? 'max-h-32' : ''}`}>
          {tweet.media.type === 'photo' && (
            <img
              src={tweet.media.source}
              alt=""
              className={`w-full h-auto transition-all duration-300 ease-out ${layout === 'compact' ? 'object-cover' : ''}`}
              loading="lazy"
            />
          )}
          {(tweet.media.type === 'video' || tweet.media.type === 'animated_gif') && (
            <video
              src={tweet.media.source}
              controls={tweet.media.type === 'video'}
              autoPlay={tweet.media.type === 'animated_gif'}
              loop={tweet.media.type === 'animated_gif'}
              muted={tweet.media.type === 'animated_gif'}
              className={`w-full h-auto transition-all duration-300 ease-out ${layout === 'compact' ? 'max-h-32 object-cover' : ''}`}
            />
          )}
        </div>
      )}

      <p className="text-[#71767b] text-sm">
        {formatDate(tweet.timestamp)}
      </p>
    </article>
  );
}