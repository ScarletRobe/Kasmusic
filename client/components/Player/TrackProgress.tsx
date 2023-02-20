import React from 'react';
import styles from './Player.module.css';

import { Box, Stack, Slider } from '@mui/material';

interface TrackProgressProps {
  left: number;
  right: number;
  onChange: (_, value: number | number[]) => void;
}

const TrackProgress: React.FC<TrackProgressProps> = ({
  left,
  right,
  onChange,
}) => {
  return (
    <Box ml="auto" mr={2} sx={{ flex: '1' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Slider
          aria-label="Progression"
          min={0}
          max={right}
          value={left}
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
