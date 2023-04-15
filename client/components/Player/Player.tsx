import React, { useEffect } from 'react';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeDown,
  RepeatRounded,
} from '@mui/icons-material';
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
  setIsLoop,
} from '@/store/playerSlice/playerSlice';

import styles from './Player.module.css';
import { GET_MEDIA_BASE_URL } from '@/consts';

let audio: HTMLAudioElement | null = null;

const Player = () => {
  const dispatch = useDispatch();

  // Player destructuring causes rerender when any state property is changed even unused ones
  const pause = useTypedSelector((state) => state.player.pause);
  const activeTrack = useTypedSelector((state) => state.player.activeTrack);
  const volume = useTypedSelector((state) => state.player.volume);
  const isLoop = useTypedSelector((state) => state.player.isLoop);

  useEffect(() => {
    if (!audio) {
      audio = new Audio();
    } else {
      setAudio();
      audio.onloadeddata = () => {
        play();
      };
    }
  }, [activeTrack]);

  useEffect(() => {
    if (!audio) {
      return;
    }
    if (audio.src) {
      !pause ? audio?.play() : audio?.pause();
    }
  }, [pause]);

  useEffect(() => {
    if (!audio) {
      return;
    }
    audio.loop = isLoop;
  }, [isLoop]);

  const setAudio = () => {
    if (activeTrack && audio) {
      audio.src = GET_MEDIA_BASE_URL + activeTrack.audio.url;
      audio.volume = volume / 100;
      audio.loop = isLoop;
      audio.onloadedmetadata = () => {
        if (!audio) {
          return;
        }
        dispatch(setDuration(Math.ceil(audio.duration)));
      };
      audio.ontimeupdate = () => {
        if (!audio) {
          return;
        }
        dispatch(setCurrentTime(Math.ceil(audio.currentTime)));
      };
      audio.onended = () => {
        dispatch(setPause());
      };
    }
  };

  const play = () => {
    if (!audio) {
      return;
    }

    if (pause) {
      dispatch(setPlay());
    } else {
      dispatch(setPause());
    }
  };

  const changeVolume = (_: any, value: number | number[]) => {
    if (!audio) {
      dispatch(setVolume(0));
      return;
    }
    audio.volume = Number(value) / 100;
    dispatch(setVolume(Number(value)));
  };

  const changeCurrentTime = (_: any, value: number | number[]) => {
    if (!audio) {
      dispatch(setCurrentTime(0));
      return;
    }
    audio.currentTime = Number(value);
    dispatch(setCurrentTime(Number(value)));
  };

  if (!activeTrack) {
    return null;
  }

  return (
    <div className={styles.player}>
      <IconButton onClick={play}>
        {pause ? <PlayArrow color="primary" /> : <Pause color="primary" />}
      </IconButton>
      <Stack direction="row" className={styles.trackInfo} spacing="2">
        <img
          width="50"
          height="50"
          src={GET_MEDIA_BASE_URL + activeTrack.picture.url}
          alt="Track cover"
        ></img>
        <Grid
          container
          direction="column"
          sx={{ flex: '1', overflow: 'hidden' }}
        >
          <div className={styles.trackInfoItem}>{activeTrack?.name}</div>
          <div className={[styles.trackInfoItem, styles.artist].join(' ')}>
            {activeTrack?.artist}
          </div>
        </Grid>
      </Stack>
      <TrackProgress onChange={changeCurrentTime} />
      <Stack
        direction="row"
        justifyContent="spaceBetween"
        alignItems="center"
        className={styles.audioControl}
      >
        <IconButton
          onClick={() => {
            dispatch(setIsLoop(!isLoop));
          }}
        >
          <RepeatRounded htmlColor={isLoop ? 'black' : 'gray'} />
        </IconButton>
      </Stack>
      <Box ml="auto" sx={{ width: 200 }}>
        <Stack direction="row" alignItems="center">
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
