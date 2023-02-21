import React from 'react';
import styles from './Player.module.css';

import { Box, Stack, Slider } from '@mui/material';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { getFormattedTime } from '@/utils';

interface TrackProgressProps {
  onChange: (_: any, value: number | number[]) => void;
}

const TrackProgress: React.FC<TrackProgressProps> = ({ onChange }) => {
  // Player destructuring causes rerender when any state property is changed even unused ones
  const duration = useTypedSelector((state) => state.player.duration);
  const currentTime = useTypedSelector((state) => state.player.currentTime);

  return (
    <Box ml="auto" mr={2} sx={{ flex: '1' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Slider
          aria-label="Progression"
          min={0}
          max={duration}
          value={currentTime}
          onChange={onChange}
        />
        <div className={styles.progressionValue}>
          {getFormattedTime(currentTime)} / {getFormattedTime(duration)}
        </div>
      </Stack>
    </Box>
  );
};

export default TrackProgress;
