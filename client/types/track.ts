import { SortTypes } from '@/consts';

export type Comment = {
  _id: string;
  user: Author;
  text: string;
};

type CommentToSend = {
  user: string;
  text: string;
};

type Media = {
  url: string;
  name: string;
};

type Author = {
  _id: string;
  username: string;
  avatarLink: string;
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
  author: Author;
  createdAt: Date;
  likes: number;
};

export enum AcceptableFiles {
  AUDIO = 'audio/*',
  IMAGE = 'image/*',
}

export enum EditableFields {
  NAME = 'name',
  ARTIST = 'artist',
}

export type GetTracksParams = {
  page: number;
  sort: SortTypes;
};

export type GetTracksResponse = {
  totalPages: number;
  data: Track[];
};

export type AddCommentsParams = {
  trackId: string;
  comment: CommentToSend;
};

export type EditTrackParams = {
  id: string;
  field: EditableFields;
  newValue: string;
};

export type IncrementListensParams = {
  id: string;
};

export type SearchTrackParams = {
  searchQuery: string;
  sort: SortTypes;
  page: number;
};

export type SearchTrackResponse = {
  totalPages: number;
  amount: number;
  data: Track[];
};
