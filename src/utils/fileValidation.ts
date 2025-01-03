import { Tweet } from '../types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['application/json'];

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileValidationError';
  }
}

export const validateFile = (file: File): void => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new FileValidationError('File size exceeds 10MB limit');
  }

  // Check file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new FileValidationError('Only JSON files are allowed');
  }
};

export const validateBookmarksData = (data: any): void => {
  if (!data) {
    throw new FileValidationError('Invalid JSON format');
  }

  // Validate array format
  if (Array.isArray(data)) {
    if (!data.every(isValidBookmark)) {
      throw new FileValidationError('Invalid bookmark format in array');
    }
    return;
  }

  // Validate object with content array format
  if (typeof data === 'object' && Array.isArray(data.content)) {
    if (!data.content.every(isValidBookmark)) {
      throw new FileValidationError('Invalid bookmark format in content');
    }
    return;
  }

  throw new FileValidationError('Invalid bookmarks format');
};

const isValidBookmark = (bookmark: any): boolean => {
  // Check for Twitter Bookmark Exporter format
  if (bookmark.author && bookmark.link) {
    return (
      typeof bookmark.text === 'string' &&
      typeof bookmark.author === 'string' &&
      typeof bookmark.timestamp === 'string' &&
      typeof bookmark.id === 'string' &&
      isValidTimestamp(bookmark.timestamp)
    );
  }

  // Check for standard format
  return (
    typeof bookmark.text === 'string' &&
    typeof bookmark.username === 'string' &&
    typeof bookmark.timestamp === 'string' &&
    typeof bookmark.id === 'string' &&
    isValidTimestamp(bookmark.timestamp) &&
    (bookmark.media === null ||
      (typeof bookmark.media === 'object' &&
        typeof bookmark.media.type === 'string' &&
        typeof bookmark.media.source === 'string'))
  );
};

const isValidTimestamp = (timestamp: string): boolean => {
  const date = new Date(timestamp);
  return date instanceof Date && !isNaN(date.getTime());
};