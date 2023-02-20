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
  tagTypes: ['track'],
  endpoints: (builder) => ({
    getAllTracks: builder.query<Track[], GetTracksParams>({
      query: ({ count = '25', offset = '0' }) => ({
        url: '/tracks',
        params: {
          count,
          offset,
        },
      }),
      providesTags: ['track'],
    }),
    createTrack: builder.mutation<Track, Track>({
      query: (body: Track) => ({
        url: '/tracks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['track'],
    }),
    deleteTrack: builder.mutation<string, string>({
      query: (id: string) => ({
        url: `/tracks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['track'],
    }),
  }),
});

export const {
  useGetAllTracksQuery,
  useCreateTrackMutation,
  useDeleteTrackMutation,
  util: { getRunningQueriesThunk },
} = tracksApi;

export const { getAllTracks, createTrack } = tracksApi.endpoints;
