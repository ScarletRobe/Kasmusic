// export const BASE_SERVER_URL = 'http://localhost:5000/';
export const BASE_SERVER_URL = 'https://music-platform-back.vercel.app/';
export const TRACKS_URL = `${BASE_SERVER_URL}tracks/`;
export const GET_MEDIA_BASE_URL = 'https://getfile.dokpub.com/yandex/get/';

export enum SortTypes {
  MOST_LISTENED = 'По убыванию прослушиваний',
  LEAST_LISTENED = 'По возрастанию прослушиваний',
  NEWEST = 'Последние добавленные',
  LATEST = 'Первые добавленные',
}

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}
