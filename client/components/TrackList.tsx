import React from 'react';

import TrackItem from './TrackItem/TrackItem';

import { Grid, Box } from '@mui/material';

import { Stack } from '@mui/system';
import Sort from './Sort';
import { Track } from '@/types/track';

type TrackListProps = {
  tracks: Track[] | undefined;
  isLoading: boolean;
  isError: boolean;
  withoutSort?: boolean;
};

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  isLoading,
  isError,
}) => {
  if (isLoading) return <div>Loading</div>;
  if (isError || !tracks) return <div>Error</div>;

  return (
    <>
      <Box pl={4} pr={4}>
        <Stack direction="row" justifyContent="flex-end">
          <Sort />
        </Stack>
        <Grid container direction="column">
          <Box pt={2} pb={2}>
            {tracks.map((track) => (
              <TrackItem key={track._id} track={track} />
            ))}
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default TrackList;
