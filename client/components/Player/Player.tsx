import React, { useEffect, useState } from 'react';
import styles from './Player.module.css';
import { PlayArrow, Pause, VolumeUp, VolumeDown } from '@mui/icons-material';
import { IconButton, Grid, Slider, Box, Stack } from '@mui/material';
import TrackProgress from './TrackProgress';
const Player = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const active = { name: 'Название', artist: 'Исполнитель' };
  const changeVolume = (_, value: number | number[]) => {
    setVolume(Number(value));
  };
  const changeCurrentTime = (_, value: number | number[]) => {
    setCurrentTime(Number(value));
  };

  return (
    <div className={styles.player}>
      <IconButton onClick={() => setIsPlaying((isPlaying) => !isPlaying)}>
        {!isPlaying ? <PlayArrow /> : <Pause />}
      </IconButton>
      <Grid container direction="column" className={styles.trackInfo}>
        <div>{active?.name}</div>
        <div className={styles.artist}>{active?.artist}</div>
      </Grid>
      <TrackProgress
        left={currentTime}
        right={100}
        onChange={changeCurrentTime}
      />
      <Box ml="auto" sx={{ width: 200 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <VolumeDown />
          <Slider
            aria-label="Volume"
            min={0}
            max={100}
            value={volume}
            onChange={changeVolume}
          />
          <VolumeUp />
        </Stack>
      </Box>
    </div>
  );
};

export default Player;
