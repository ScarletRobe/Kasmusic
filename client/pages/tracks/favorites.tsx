import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { setCurrentPage, setCurrentSort } from '@/store/appSlice/appSlice';
import { useGetFavoritesTracksQuery } from '@/services/tracksService';

import { useTypedSelector } from '@/hooks/useTypedSelector';

import TrackList from '@/components/TrackList';
import { WithAuth } from '@/components/HOCs/WithAuth';

import { PageRoutes, SortTypes } from '@/consts';

import { Grid, Card, Box, Button } from '@mui/material';

const Index: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const currentPage = useTypedSelector((state) => state.app.currentPage);

  const { data, isFetching, isError } = useGetFavoritesTracksQuery({
    page: currentPage,
  });

  useEffect(() => {
    return () => {
      dispatch(setCurrentSort(SortTypes.NEWEST));
      dispatch(setCurrentPage(1));
    };
  }, []);

  return (
    <>
      <Head>
        <meta name="referrer" content="no-referrer"></meta>
      </Head>
      <Grid container justifyContent="center">
        <Card className="track-list-wrapper">
          <Box p={3}>
            <Grid container justifyContent="space-between">
              <h1>Любимые</h1>
              <Button onClick={() => router.push(PageRoutes.Upload)}>
                Загрузить
              </Button>
            </Grid>
          </Box>
          <TrackList
            tracksData={data}
            isLoading={isFetching}
            isError={isError}
          />
        </Card>
      </Grid>
    </>
  );
};

export default WithAuth(Index);
