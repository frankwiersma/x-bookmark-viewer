import React from 'react';
import { TweetCard } from './TweetCard';
import { useBookmarksStore } from '../store/bookmarksStore';
import { Layout } from '../types';

export function BookmarksFeed() {
  const { filteredBookmarks, layout } = useBookmarksStore((state) => ({
    filteredBookmarks: state.filteredBookmarks(),
    layout: state.layout
  }));

  const layoutClasses: Record<Layout, string> = {
    list: 'relative z-20 space-y-4 max-w-2xl mx-auto pt-2 transition-all duration-300 ease-out',
    grid: 'relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto transition-all duration-300 ease-out',
    compact: 'relative z-20 space-y-2 max-w-7xl mx-auto pt-2 transition-all duration-300 ease-out'
  };

  return (
    <div className={layoutClasses[layout]}>
      {filteredBookmarks.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} layout={layout} />
      ))}
    </div>
  );
}