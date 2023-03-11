import { Track } from '@/types/track';
import { useIncrementListensMutation } from '@/services/tracksService';
import {
  setPlay,
  setPause,
  setActiveTrack,
} from '@/store/playerSlice/playerSlice';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from './useTypedSelector';
import { useState } from 'react';

export const useSetActiveTrack = (initialTrack?: Track) => {
  const dispatch = useDispatch();
  const currentSort = useTypedSelector((state) => state.app.currentSort);
  const activeTrack = useTypedSelector((state) => state.player.activeTrack);
  const pause = useTypedSelector((state) => state.player.pause);

  const [incListens] = useIncrementListensMutation();

  const [track, setTrack] = useState<Track | undefined>(initialTrack);

  const play = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!track) {
      return;
    }
    if (activeTrack?._id === track._id) {
      pause ? dispatch(setPlay()) : dispatch(setPause());
    } else {
      dispatch(setPause());
      dispatch(setActiveTrack({ ...track }));
      incListens({ id: track._id, sort: currentSort });
    }
  };

  return { setTrack, play };
};
