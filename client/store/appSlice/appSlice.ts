import { SortTypes } from '@/consts';
import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';

type PlayerInitialState = {
  currentSort: SortTypes;
  currentPage: number;
  searchQuery: string;
};

const initialState: PlayerInitialState = {
  currentSort: SortTypes.NEWEST,
  currentPage: 1,
  searchQuery: '',
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
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setCurrentSort, setCurrentPage, setSearchQuery } =
  appSlice.actions;
