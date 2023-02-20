export type Comment = {
  _id: string;
  username: string;
  text: string;
};

export type Track = {
  _id: string;
  name: string;
  artist: string;
  text: string;
  listens: number;
  picture: string;
  audio: string;
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
