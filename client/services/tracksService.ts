import { GetTracksParams, Track } from '../types/track';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

export const tracksApi = createApi({
  reducerPath: 'tracks',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getAllTracks: builder.query<Track[], GetTracksParams>({
      query: ({ count = '25', offset = '0' }) => ({
        url: '/tracks',
        params: {
          count,
          offset,
        },
      }),
    }),
});

export const {
  useGetAllTracksQuery,
  util: { getRunningQueriesThunk },
} = tracksApi;

export const {
  getAllTracks,
} = tracksApi.endpoints;
