import React from 'react';

import TrackItem from './TrackItem/TrackItem';
import { Track } from '@/types/track';

import { Grid, Box } from '@mui/material';

type TrackListProps = {
  tracks: Track[];
};

const TrackList: React.FC<TrackListProps> = ({ tracks }) => {
  if (!tracks) {
    return <div>Ошибка</div>;
  }

  return (
    <Grid container direction="column">
      <Box p={2}>
        {tracks.map((track) => (
          <TrackItem key={track._id} track={track} />
        ))}
      </Box>
    </Grid>
  );
};

export default TrackList;
