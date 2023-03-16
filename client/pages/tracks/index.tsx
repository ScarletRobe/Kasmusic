import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Grid, Card, Box, Button } from '@mui/material';
import TrackList from '@/components/TrackList';
import { Track } from '@/types/track';
import Head from 'next/head';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useGetAllTracksQuery } from '@/services/tracksService';
import { SortTypes } from '@/consts';
import { setCurrentPage, setCurrentSort } from '@/store/appSlice/appSlice';
import { useDispatch } from 'react-redux';

const Index: React.FC<{ tracks: Track[] }> = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const currentSort = useTypedSelector((state) => state.app.currentSort);
  const currentPage = useTypedSelector((state) => state.app.currentPage);

  const { data, isFetching, isError } = useGetAllTracksQuery({
    page: currentPage,
    sort: currentSort,
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
              <h1>Список треков</h1>
              <Button onClick={() => router.push('/tracks/upload')}>
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

export default Index;
