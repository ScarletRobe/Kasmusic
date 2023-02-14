import React from 'react';
import { Track } from '../../types/track';
import styles from './TrackItem.module.css';
import { useRouter } from 'next/router';
import { PlayArrow, Pause, Delete } from '@mui/icons-material';
import { Card, IconButton, Grid } from '@mui/material';
import Image from 'next/image';

interface TrackItemProps {
  track: Track;
  active?: boolean;
}

const TrackItem: React.FC<TrackItemProps> = ({ track, active = false }) => {
  const router = useRouter();

  return (
    <Card
      className={styles.track}
      onClick={() => router.push('/tracks/' + track._id)}
    >
      <IconButton>{active ? <Pause /> : <PlayArrow />}</IconButton>
      <Image
        className={styles.trackCover}
        src=""
        alt="Track cover"
      />
      <Grid container direction="column" className={styles.trackContainer}>
        <div>{track.name}</div>
        <div className={styles.trackArtist}>{track.artist}</div>
      </Grid>
      {active && <div>02:42 / 03:22</div>}
      <IconButton
        onClick={(e) => e.stopPropagation()}
        className={styles.trackDeleteBtn}
      >
        <Delete />
      </IconButton>
    </Card>
  );
};

export default TrackItem;
