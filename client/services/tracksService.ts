import { SearchTrackResponse, GetTracksResponse } from './../types/track';
import { RootState } from './../store/rootReducer';
import { BASE_SERVER_URL } from './../consts';
import {
  AddCommentsParams,
  Comment,
  EditTrackParams,
  GetTracksParams,
  IncrementListensParams,
  SearchTrackParams,
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
    getAllTracks: builder.query<GetTracksResponse, GetTracksParams>({
      query: ({ page, sort }) => ({
        url: '/tracks',
        params: {
          count: 20,
          offset: (page - 1) * 20,
          sort,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((res) => ({
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
    searchTrack: builder.query<SearchTrackResponse, SearchTrackParams>({
      query: ({ searchQuery, sort, page }) => ({
        url: `/tracks/search`,
        params: {
          count: 20,
          offset: (page - 1) * 20,
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
    editTrack: builder.mutation<string, EditTrackParams>({
      query: ({ id, field, newValue }) => ({
        url: `/tracks/${id}`,
        method: 'PATCH',
        body: { [field]: newValue },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'trackList', id: arg.id },
        'track',
        'trackList',
      ],
    }),
    incrementListens: builder.mutation<Track, IncrementListensParams>({
      query: ({ id }) => ({
        url: `/tracks/listen/${id}`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'trackList', id: 'searchResult' }],
      async onQueryStarted({ id, sort, page }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tracksApi.util.updateQueryData(
            'getAllTracks',
            { page, sort },
            (draft) => {
              const track = draft.data.find((track) => track._id === id);
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
  useEditTrackMutation,
  util: { getRunningQueriesThunk },
} = tracksApi;

export const { getAllTracks, createTrack, getTrackById } = tracksApi.endpoints;
