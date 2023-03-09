import { Track } from '@/types/track';
import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';

type PlayerInitialState = {
  activeTrack: null | Track;
  volume: number;
  duration: number;
  currentTime: number;
  pause: boolean;
  isLoop: boolean;
};

const initialState: PlayerInitialState = {
  currentTime: 0,
  duration: 0,
  volume: 50,
  pause: true,
  activeTrack: null,
  isLoop: false,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlay: (state) => {
      state.pause = false;
    },
    setPause: (state) => {
      state.pause = true;
    },
    setActiveTrack: (state, action: PayloadAction<Track | null>) => {
      state.activeTrack = action.payload;
      state.duration = 0;
      state.currentTime = 0;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setIsLoop: (state, action: PayloadAction<boolean>) => {
      state.isLoop = action.payload;
    },
  },
});

export const {
  setPlay,
  setPause,
  setActiveTrack,
  setCurrentTime,
  setDuration,
  setVolume,
  setIsLoop,
} = playerSlice.actions;
