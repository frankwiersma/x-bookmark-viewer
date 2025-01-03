import { create } from 'zustand';
import { Tweet, Layout } from '../types';

type SortOrder = 'newest' | 'oldest';
type MediaFilter = 'all' | 'photo' | 'video' | 'animated_gif' | 'none';

interface BookmarksState {
  bookmarks: Tweet[];
  searchQuery: string;
  sortOrder: SortOrder;
  mediaFilter: MediaFilter;
  layout: Layout;
  selectedUsername: string | null;
  setBookmarks: (bookmarks: Tweet[]) => void;
  setSearchQuery: (query: string) => void;
  setSortOrder: (order: SortOrder) => void;
  setMediaFilter: (filter: MediaFilter) => void;
  setLayout: (layout: Layout) => void;
  setSelectedUsername: (username: string | null) => void;
  filteredBookmarks: () => Tweet[];
  uniqueUsernames: () => string[];
}

export const useBookmarksStore = create<BookmarksState>((set, get) => ({
  bookmarks: [],
  searchQuery: '',
  sortOrder: 'newest',
  mediaFilter: 'all',
  layout: 'grid',
  selectedUsername: null,

  setBookmarks: (bookmarks) => set({ bookmarks }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setMediaFilter: (filter) => set({ mediaFilter: filter }),
  setLayout: (layout) => set({ layout: layout }),
  setSelectedUsername: (username) => set({ selectedUsername: username }),

  filteredBookmarks: () => {
    const state = get();
    let filtered = [...state.bookmarks];

    // Apply search filter
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tweet) =>
          tweet.text.toLowerCase().includes(query) ||
          tweet.username.toLowerCase().includes(query)
      );
    }

    // Apply username filter
    if (state.selectedUsername) {
      filtered = filtered.filter(
        (tweet) => tweet.username === state.selectedUsername
      );
    }

    // Apply media filter
    if (state.mediaFilter !== 'all') {
      if (state.mediaFilter === 'none') {
        filtered = filtered.filter((tweet) => !tweet.media);
      } else {
        filtered = filtered.filter(
          (tweet) => tweet.media?.type === state.mediaFilter
        );
      }
    }

    // Apply sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return state.sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  },

  uniqueUsernames: () => {
    const state = get();
    return Array.from(new Set(state.bookmarks.map((tweet) => tweet.username)));
  },
}));