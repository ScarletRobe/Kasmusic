import { RootState } from './../store/store';
import { AuthorizationStatus, BASE_SERVER_URL } from './../consts';
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import {
  setAuthorizationStatus,
  setCredentials,
  signOut,
} from '@/store/authSlice/authSlice';
import { SignResponse, SignInParams, SignUpParams } from '@/types/auth';

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_SERVER_URL}auth`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs | any,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (args.url === '/logout') {
    api.dispatch(signOut());
    return result;
  }

  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery('/refresh', api, extraOptions);
    if (refreshResult?.data) {
      if ((result.data as SignResponse).user.isActivated) {
        api.dispatch(
          setCredentials({
            token: (refreshResult.data as SignResponse).accessToken,
            user: (result?.data as SignResponse)?.user,
          }),
        );
      }
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(signOut());
    }
  }
  if (result.data) {
    if (!(result.data as SignResponse).user.isActivated) {
      api.dispatch(signOut());
    } else {
      api.dispatch(
        setCredentials({
          token: (result?.data as SignResponse)?.accessToken,
          user: (result?.data as SignResponse)?.user,
        }),
      );
    }
  } else {
    api.dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
  }
  return result;
};

export const authApi = createApi({
  reducerPath: 'authorization',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    signIn: builder.mutation<SignResponse, SignInParams>({
      query: (credentials: SignInParams) => ({
        url: '/login',
        method: 'POST',
        body: { ...credentials },
      }),
      async onQueryStarted(_, { dispatch }) {
        dispatch(setAuthorizationStatus(AuthorizationStatus.Unknown));
      },
    }),
    signUp: builder.mutation<SignResponse, SignUpParams>({
      query: (credentials: SignUpParams) => ({
        url: '/register',
        method: 'POST',
        body: { ...credentials },
      }),
      async onQueryStarted(_, { dispatch }) {
        dispatch(setAuthorizationStatus(AuthorizationStatus.Unknown));
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'GET',
      }),
      async onQueryStarted(_, { dispatch }) {
        dispatch(setAuthorizationStatus(AuthorizationStatus.Unknown));
      },
    }),
    refresh: builder.query({
      query: () => ({
        url: '/refresh',
        method: 'GET',
      }),
    }),
  }),
});

export const { refresh, logout } = authApi.endpoints;

export const { useSignInMutation, useSignUpMutation, useLogoutMutation } =
  authApi;
