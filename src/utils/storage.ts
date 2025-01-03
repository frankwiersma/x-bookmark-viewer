import { Tweet } from '../types';

const STORAGE_KEY = 'twitter_bookmarks';

export const saveBookmarksToStorage = (bookmarks: Tweet[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Failed to save bookmarks to storage:', error);
  }
};

export const loadBookmarksFromStorage = (): Tweet[] | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load bookmarks from storage:', error);
    return null;
  }
};

export const clearBookmarksFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear bookmarks from storage:', error);
  }
};