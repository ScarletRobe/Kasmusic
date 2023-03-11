import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { GET_MEDIA_BASE_URL } from '@/consts';
import { Track } from '../../types/track';

import { useDeleteTrackMutation } from '@/services/tracksService';

import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useSetActiveTrack } from '@/hooks/useSetActiveTrack';

import { PlayArrow, Pause, Delete } from '@mui/icons-material';
import { Card, IconButton, Grid } from '@mui/material';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';

import styles from './TrackItem.module.css';

interface TrackItemProps {
  track: Track;
}

const TrackItem: React.FC<TrackItemProps> = ({ track }) => {
  const router = useRouter();
  const [deleteTrack] = useDeleteTrackMutation();

  // Player destructuring causes rerender when any state property is changed even unused ones
  const activeTrack = useTypedSelector((state) => state.player.activeTrack);
  const pause = useTypedSelector((state) => state.player.pause);

  const { play } = useSetActiveTrack(track);

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
      <img
        className={styles.trackCover}
        src={GET_MEDIA_BASE_URL + track.picture.url}
        width={70}
        height={70}
        alt="Track cover"
      />
      <Grid container direction="column" className={styles.trackContainer}>
        <div>{track.name}</div>
        <div className={styles.trackArtist}>{track.artist}</div>
      </Grid>
      <RemoveRedEyeRoundedIcon sx={{ mr: '5px' }} />
      <div>{track.listens}</div>
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
