import React from 'react';

import TrackItem from './TrackItem/TrackItem';

import { Grid, Box } from '@mui/material';

import { useGetAllTracksQuery } from '@/services/tracksService';
import { Stack } from '@mui/system';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import Sort from './Sort';

const TrackList: React.FC = () => {
  const currentSort = useTypedSelector((state) => state.app.currentSort);

  const { data, isLoading, isError } = useGetAllTracksQuery({
    count: '50',
    offset: '0',
    sort: currentSort,
  });

  if (isLoading) return <div>Loading</div>;
  if (isError || !data) return <div>Error</div>;

  return (
    <>
      <Box pl={4} pr={4}>
        <Stack direction="row" justifyContent="flex-end">
          <Sort />
        </Stack>
        <Grid container direction="column">
          <Box pt={2} pb={2}>
            {data.map((track) => (
              <TrackItem key={track._id} track={track} />
            ))}
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default TrackList;
