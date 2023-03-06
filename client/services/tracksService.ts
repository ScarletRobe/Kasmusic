import { BASE_SERVER_URL, SortTypes } from './../consts';
import {
  AddCommentsParams,
  Comment,
  GetTracksParams,
  Track,
} from '../types/track';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

export const tracksApi = createApi({
  reducerPath: 'tracks',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_SERVER_URL }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['trackList', 'track'],
  endpoints: (builder) => ({
    getAllTracks: builder.query<Track[], GetTracksParams>({
      query: ({ count = '25', offset = '0', sort }) => ({
        url: '/tracks',
        params: {
          count,
          offset,
          sort,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((res) => ({
                type: 'trackList' as const,
                id: Number(res._id),
              })),
              { type: 'trackList', id: 'partial-trackList' },
              { type: 'trackList' },
            ]
          : [
              { type: 'trackList', id: 'partial-trackList' },
              { type: 'trackList' },
            ],
    }),
    getTrackById: builder.query<Track, string>({
      query: (id) => ({
        url: `/tracks/${id}`,
      }),
      providesTags: (result, error, arg) => [
        { type: 'trackList', id: Number(arg) },
        'track',
      ],
    }),
    searchTrack: builder.query<
      Track[],
      { searchQuery: string; sort: SortTypes }
    >({
      query: ({ searchQuery, sort }) => ({
        url: `/tracks/search`,
        params: {
          query: searchQuery,
          sort,
        },
      }),
      providesTags: [{ type: 'trackList', id: 'searchResult' }],
    }),
    createComment: builder.mutation<Comment, AddCommentsParams>({
      query: ({ comment, trackId }) => ({
        url: `/tracks/comment`,
        method: 'POST',
        body: {
          ...comment,
          trackId,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'trackList', id: arg.trackId },
        'track',
      ],
    }),
    createTrack: builder.mutation<Track, FormData>({
      query: (body: FormData) => ({
        url: '/tracks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['trackList'],
    }),
    deleteTrack: builder.mutation<string, string>({
      query: (id: string) => ({
        url: `/tracks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['trackList'],
    }),
    incrementListens: builder.mutation<Track, { id: string; sort: SortTypes }>({
      query: ({ id }) => ({
        url: `/tracks/listen/${id}`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'trackList', id: 'searchResult' }],
      async onQueryStarted({ id, sort }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tracksApi.util.updateQueryData(
            'getAllTracks',
            { count: '50', offset: '0', sort },
            (draft) => {
              const track = draft.find((track) => track._id === id);
              if (track) {
                track.listens++;
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetAllTracksQuery,
  useCreateTrackMutation,
  useDeleteTrackMutation,
  useGetTrackByIdQuery,
  useCreateCommentMutation,
  useSearchTrackQuery,
  useIncrementListensMutation,
  util: { getRunningQueriesThunk },
} = tracksApi;

export const { getAllTracks, createTrack, getTrackById } = tracksApi.endpoints;
