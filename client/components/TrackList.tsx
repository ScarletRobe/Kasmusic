import React from 'react';

import { Track } from '@/types/track';

import TrackItem from './TrackItem/TrackItem';
import Loader from './Loaders/Loader';
import Sort from './Sort';

import { Grid, Box, Pagination } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Stack } from '@mui/system';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '@/store/appSlice/appSlice';

type TrackListProps = {
  tracksData: { totalPages: number; data: Track[] } | undefined;
  isLoading: boolean;
  isError: boolean;
  withoutSort?: boolean;
};

const TrackList: React.FC<TrackListProps> = ({
  tracksData,
  isLoading,
  isError,
}) => {
  const dispatch = useDispatch();

  const currentPage = useTypedSelector((state) => state.app.currentPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    dispatch(setCurrentPage(value));
  };

  return (
    <>
      <Box pl={4} pr={4} pb={2}>
        {isLoading ? (
          <Loader />
        ) : !isError && tracksData ? (
          <>
            <Stack direction="row" justifyContent="flex-end">
              {!!tracksData.data.length && <Sort />}
            </Stack>
            <Grid container direction="column">
              <Box pt={2} pb={2}>
                {tracksData.data.map((track) => (
                  <TrackItem key={track._id} track={track} />
                ))}
              </Box>
            </Grid>
            <Stack alignItems="center">
              <Pagination
                count={tracksData?.totalPages}
                page={currentPage}
                onChange={handlePageChange}
              />
            </Stack>
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
