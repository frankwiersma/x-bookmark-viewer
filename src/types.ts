export type Layout = 'list' | 'grid' | 'compact';

export interface Tweet {
  id: string;
  text: string;
  timestamp: string;
  media: {
    type: 'photo' | 'video' | 'animated_gif';
    source: string;
  } | null;
  username: string;
  added_to_db: string;
}