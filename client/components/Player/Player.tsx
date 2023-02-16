import React, { useEffect } from 'react';
import { PlayArrow, Pause, VolumeUp, VolumeDown } from '@mui/icons-material';
import { IconButton, Grid, Slider, Box, Stack } from '@mui/material';
import TrackProgress from './TrackProgress';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import {
  setCurrentTime,
  setDuration,
  setPlay,
  setVolume,
  setPause,
} from '@/store/playerSlice/playerSlice';

import styles from './Player.module.css';

let audio: HTMLAudioElement | null = null;

const Player = () => {
  const dispatch = useDispatch();
  const { pause, activeTrack, duration, currentTime, volume } =
    useTypedSelector((state) => state.player);

  useEffect(() => {
    if (!audio) {
      audio = new Audio();
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const active = { name: 'Название', artist: 'Исполнитель' };
    } else {
      setAudio();
      play();
    }
  }, [activeTrack]);

  const setAudio = () => {
    if (activeTrack && audio) {
      audio.src = 'http://localhost:5000/' + activeTrack.audio;
      audio.volume = volume / 100;
      audio.onloadedmetadata = () => {
        dispatch(setDuration(Math.ceil(audio.duration)));
      };
      audio.ontimeupdate = () => {
        dispatch(setCurrentTime(Math.ceil(audio.currentTime)));
      };
    }
  };

  const play = () => {
    if (!audio) {
      return;
    }

    if (pause) {
      dispatch(setPlay());
      audio.play();
    } else {
      dispatch(setPause());
      audio.pause();
    }
  };

  const changeVolume = (_, value: number | number[]) => {
    audio.volume = Number(value) / 100;
    dispatch(setVolume(Number(value)));
  };
  const changeCurrentTime = (_, value: number | number[]) => {
    audio.currentTime = Number(value);
    dispatch(setCurrentTime(Number(value)));
  };

  if (!activeTrack) {
    return null;
  }

  return (
    <div className={styles.player}>
      <IconButton onClick={play}>
        {pause ? <PlayArrow /> : <Pause />}
      </IconButton>
      <Grid container direction="column" className={styles.trackInfo}>
        <div>{activeTrack?.name}</div>
        <div className={styles.artist}>{activeTrack?.artist}</div>
      </Grid>
      <TrackProgress
        left={currentTime}
        right={duration}
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
