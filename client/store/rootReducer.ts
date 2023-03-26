import { combineReducers } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { tracksApi } from '../services/tracksService';
import { authApi } from '@/services/authService';

import { playerSlice } from './playerSlice/playerSlice';
import { authSlice } from './authSlice/authSlice';
import { appSlice } from './appSlice/appSlice';

const rootReducer = combineReducers({
  player: playerSlice.reducer,
  app: appSlice.reducer,
  auth: authSlice.reducer,
  [tracksApi.reducerPath]: tracksApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
});

export const reducer = (state: any, action: any) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    if (state.count) nextState.count = state.count; // preserve count value on client side navigation
    return nextState;
  } else {
    return rootReducer(state, action);
  }
};

export type RootState = ReturnType<typeof rootReducer>;
