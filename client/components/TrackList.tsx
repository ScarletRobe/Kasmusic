import React from 'react';

import { Track } from '@/types/track';

import TrackItem from './TrackItem/TrackItem';
import Loader from './Loaders/Loader';
import Sort from './Sort';

import { Grid, Box } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Stack } from '@mui/system';

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
  return (
    <>
      <Box pl={4} pr={4} pb={2}>
        {isLoading ? (
          <Loader />
        ) : !isError && tracks ? (
          <>
            <Stack direction="row" justifyContent="flex-end">
              {!!tracks.length && <Sort />}
            </Stack>
            <Grid container direction="column">
              <Box pt={2} pb={2}>
                {tracks.map((track) => (
                  <TrackItem key={track._id} track={track} />
                ))}
              </Box>
            </Grid>
          </>
        ) : (
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <CloseRoundedIcon htmlColor="red" fontSize="large" />
            <div>При загрузке произошла ошибка</div>
            <div>Попробуйте позже</div>
          </Grid>
        )}
      </Box>
    </>
  );
};

export default TrackList;
