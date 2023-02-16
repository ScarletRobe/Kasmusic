import { reducer, RootState } from './rootReducer';
import { configureStore, Store } from '@reduxjs/toolkit';
import { Context, createWrapper } from 'next-redux-wrapper';

const makeStore = (context: Context) =>
  configureStore({ reducer: reducer, devTools: true });

export const wrapper = createWrapper<Store<RootState>>(makeStore);
