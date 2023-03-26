import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';

import { User } from '@/types/auth';

type AuthInitialState = {
  user: User | null;
  token: string | null;
};

let initialState: AuthInitialState;
if (typeof window !== 'undefined') {
  initialState = {
    user: null,
    token: localStorage.getItem('kasmusicAccessToken'),
  };
} else {
  initialState = {
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
      localStorage.setItem('kasmusicAccessToken', action.payload.token);
      localStorage.setItem('kasmusicUserId', action.payload.user.id);
    },
    signOut: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('kasmusicUserId');
      localStorage.removeItem('kasmusicAccessToken');
    },
  },
});

export const { setCredentials, signOut } = authSlice.actions;
