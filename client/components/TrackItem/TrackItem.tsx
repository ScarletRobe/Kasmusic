import React from 'react';
import { useRouter } from 'next/router';

import { GET_MEDIA_BASE_URL, PageRoutes } from '@/consts';
import { Track } from '../../types/track';

import { useDeleteTrackMutation } from '@/services/tracksService';

import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useSetActiveTrack } from '@/hooks/useSetActiveTrack';

import CopyToClipboardBtn from '../UI/CopyToClipboard/CopyToClipboardBtn';

import { Card, IconButton, Grid } from '@mui/material';
import { Stack } from '@mui/system';
import {
  PlayArrow,
  Pause,
  DownloadRounded,
  RemoveRedEyeRounded,
} from '@mui/icons-material';

import styles from './TrackItem.module.css';
import LikeBtn from '../UI/LikeBtn/LikeBtn';
import DeleteBtn from '../UI/DeleteBtn/DeleteBtn';

interface TrackItemProps {
  track: Track;
}

const TrackItem: React.FC<TrackItemProps> = ({ track }) => {
  const router = useRouter();

  // Player destructuring causes rerender when any state property is changed even unused ones
  const activeTrack = useTypedSelector((state) => state.player.activeTrack);
  const pause = useTypedSelector((state) => state.player.pause);

  const { play } = useSetActiveTrack(track);

  return (
    <Card
      className={styles.track}
      onClick={() => router.push(`${PageRoutes.Tracks}/${track._id}`)}
    >
      <IconButton onClick={play}>
        {activeTrack?._id === track._id && !pause ? (
          <Pause color="primary" />
        ) : (
          <PlayArrow color="primary" />
        )}
      </IconButton>
      <img
        className={styles.trackCover}
        src={GET_MEDIA_BASE_URL + track.picture.url}
        width="70"
        height="70"
        alt="Track cover"
      />
      <Grid container direction="column" className={styles.trackContainer}>
        <div>{track.name}</div>
        <div className={styles.trackArtist}>{track.artist}</div>
      </Grid>
      <Stack direction="row" sx={{ mr: '10px' }}>
        <RemoveRedEyeRounded sx={{ mr: '5px' }} />
        <div>{track.listens}</div>
      </Stack>
      <LikeBtn trackId={track._id} variant="iconButton" />
      <CopyToClipboardBtn
        textToCopy={`https://music-platform-sage.vercel.app/tracks/${track._id}`}
      />
      <a
        href={GET_MEDIA_BASE_URL + track.audio.url}
        target="_blank"
        rel="noreferrer"
      >
        <IconButton onClick={(e) => e.stopPropagation()}>
          <DownloadRounded />
        </IconButton>
      </a>
      <DeleteBtn trackId={track._id} />
    </Card>
  );
};

export default TrackItem;
