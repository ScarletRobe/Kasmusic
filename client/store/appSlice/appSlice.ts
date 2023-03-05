import { SortTypes } from '@/consts';
import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';

type PlayerInitialState = {
  currentSort: SortTypes;
};

const initialState: PlayerInitialState = {
  currentSort: SortTypes.NEWEST,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentSort: (state, action: PayloadAction<SortTypes>) => {
      state.currentSort = action.payload;
    },
  },
});

export const { setCurrentSort } = appSlice.actions;
