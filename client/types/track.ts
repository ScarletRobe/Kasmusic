export type Comment = {
  _id: string;
  username: string;
  text: string;
};

type Media = {
  url: string;
  name: string;
};

export type Track = {
  _id: string;
  name: string;
  artist: string;
  text: string;
  listens: number;
  picture: Media;
  audio: Media;
  comments: Comment[];
};

export enum AcceptableFiles {
  AUDIO = 'audio/*',
  IMAGE = 'image/*',
}

export type GetTracksParams = {
  count: string;
  offset: string;
};

export type AddCommentsParams = {
  trackId: string;
  comment: Omit<Comment, '_id'>;
};
