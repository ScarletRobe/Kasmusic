import React from 'react';

import TrackItem from './TrackItem/TrackItem';

import { Grid, Box } from '@mui/material';
import { useGetAllTracksQuery } from '@/services/tracksService';

const TrackList: React.FC = () => {
  const { data, isLoading, isError } = useGetAllTracksQuery({
    count: '50',
    offset: '0',
  });

  if (isLoading) return <div>Loading</div>;
  if (isError) return <div>Error</div>;
  if (!data) return null;

  return (
    <Grid container direction="column">
      <Box p={2}>
        {data.map((track) => (
          <TrackItem key={track._id} track={track} />
        ))}
      </Box>
    </Grid>
  );
};

export default TrackList;
