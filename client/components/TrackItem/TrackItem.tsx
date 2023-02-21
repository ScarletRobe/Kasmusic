import React, { useEffect } from 'react';
import { Track } from '../../types/track';
import styles from './TrackItem.module.css';
import { useRouter } from 'next/router';
import { PlayArrow, Pause, Delete } from '@mui/icons-material';
import { Card, IconButton, Grid } from '@mui/material';
import Image from 'next/image';
import {
  setActiveTrack,
  setPause,
  setPlay,
} from '@/store/playerSlice/playerSlice';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useDeleteTrackMutation } from '@/services/tracksService';

interface TrackItemProps {
  track: Track;
}

const TrackItem: React.FC<TrackItemProps> = ({ track }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [deleteTrack, { isLoading, isError }] = useDeleteTrackMutation();

  // Player destructuring causes rerender when any state property is changed even unused ones
  const activeTrack = useTypedSelector((state) => state.player.activeTrack);
  const pause = useTypedSelector((state) => state.player.pause);

  const play = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (activeTrack?._id === track._id) {
      pause ? dispatch(setPlay()) : dispatch(setPause());
    } else {
      dispatch(setPause());
      dispatch(setActiveTrack(track));
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteTrack(track._id);
  };

  return (
    <Card
      className={styles.track}
      onClick={() => router.push('/tracks/' + track._id)}
    >
      <IconButton onClick={play}>
        {activeTrack?._id === track._id && !pause ? <Pause /> : <PlayArrow />}
      </IconButton>
      <Image
        className={styles.trackCover}
        src={'http://localhost:5000/' + track.picture}
        width={70}
        height={70}
        alt="Track cover"
      />
      <Grid container direction="column" className={styles.trackContainer}>
        <div>{track.name}</div>
        <div className={styles.trackArtist}>{track.artist}</div>
      </Grid>
      {/* {active && <div>02:42 / 03:22</div>} */}
      <IconButton
        onClick={(e) => handleDelete(e)}
        className={styles.trackDeleteBtn}
      >
        <Delete />
      </IconButton>
    </Card>
  );
};

export default TrackItem;
