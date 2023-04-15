import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';

import { User } from '@/types/auth';
import { AuthorizationStatus } from '@/consts';

type AuthInitialState = {
  authorizationStatus: AuthorizationStatus;
  user: User | null;
  token: string | null;
};

let initialState: AuthInitialState;
if (typeof window !== 'undefined') {
  initialState = {
    authorizationStatus: AuthorizationStatus.Unknown,
    user: null,
    token: localStorage.getItem('kasmusicAccessToken'),
  };
} else {
  initialState = {
    authorizationStatus: AuthorizationStatus.Unknown,
    user: null,
    token: null,
  };
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.authorizationStatus = AuthorizationStatus.Auth;
      localStorage.setItem('kasmusicAccessToken', action.payload.token);
    },
    signOut: (state) => {
      state.user = null;
      state.token = null;
      state.authorizationStatus = AuthorizationStatus.NoAuth;
      localStorage.removeItem('kasmusicAccessToken');
    },
    setAuthorizationStatus: (
      state,
      action: PayloadAction<AuthorizationStatus>,
    ) => {
      state.authorizationStatus = action.payload;
    },
    addLikeToState: (state, action: PayloadAction<string>) => {
      state.user?.likedTracks.push(action.payload);
    },
    removeLikeFromState: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.likedTracks = state.user.likedTracks.filter(
          (el) => el !== action.payload,
        );
      }
    },
  },
});

export const {
  setCredentials,
  signOut,
  setAuthorizationStatus,
  addLikeToState,
  removeLikeFromState,
} = authSlice.actions;
