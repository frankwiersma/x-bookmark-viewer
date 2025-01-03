import React from 'react';
import { Search } from 'lucide-react';
import { useBookmarksStore } from '../store/bookmarksStore';

export function Controls() {
  const {
    sortOrder,
    mediaFilter,
    selectedUsername,
    searchQuery,
    setSortOrder,
    setMediaFilter,
    setSelectedUsername,
    setSearchQuery,
    uniqueUsernames,
    layout,
  } = useBookmarksStore();

  return (
    <div className={`sticky top-[73px] z-40 flex flex-wrap gap-4 p-3 bg-[#16181c] rounded-xl backdrop-blur-xl bg-opacity-90 ${layout === 'list' ? 'max-w-2xl mx-auto' : 'w-full'}`}>
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71767b]" />
        <input
          type="text"
          placeholder="Search bookmarks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black text-[#e7e9ea] rounded-full py-2 pl-12 pr-4 border border-[#2f3336] focus:outline-none focus:ring-1 focus:ring-[#1d9bf0] placeholder-[#71767b]"
        />
      </div>

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
        className="bg-black text-[#e7e9ea] rounded-full px-4 py-2 border border-[#2f3336] min-w-[140px]"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>

      <select
        value={mediaFilter}
        onChange={(e) => setMediaFilter(e.target.value as any)}
        className="bg-black text-[#e7e9ea] rounded-full px-4 py-2 border border-[#2f3336] min-w-[140px]"
      >
        <option value="all">All Media</option>
        <option value="photo">Photos Only</option>
        <option value="video">Videos Only</option>
        <option value="animated_gif">GIFs Only</option>
        <option value="none">No Media</option>
      </select>

      <select
        value={selectedUsername || ''}
        onChange={(e) => setSelectedUsername(e.target.value || null)}
        className="bg-black text-[#e7e9ea] rounded-full px-4 py-2 border border-[#2f3336] min-w-[140px]"
      >
        <option value="">All Users</option>
        {uniqueUsernames().map((username) => (
          <option key={username} value={username}>
            @{username}
          </option>
        ))}
      </select>
    </div>
  );
}