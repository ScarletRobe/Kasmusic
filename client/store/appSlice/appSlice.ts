import { SortTypes } from '@/consts';
import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';

type PlayerInitialState = {
  currentSort: SortTypes;
  currentPage: number;
};

const initialState: PlayerInitialState = {
  currentSort: SortTypes.NEWEST,
  currentPage: 1,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentSort: (state, action: PayloadAction<SortTypes>) => {
      state.currentSort = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setCurrentSort, setCurrentPage } = appSlice.actions;
