import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Grid, Card, Box } from '@mui/material';
import TrackList from '@/components/TrackList';
import { Track } from '@/types/track';
import Head from 'next/head';
import { useSearchTrackQuery } from '@/services/tracksService';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { setCurrentSort } from '@/store/appSlice/appSlice';
import { SortTypes } from '@/consts';
import { useDispatch } from 'react-redux';

const SearchPage: React.FC<{ tracks: Track[] }> = () => {
  const { query } = useRouter();
  const dispatch = useDispatch();
  const sort = useTypedSelector((store) => store.app.currentSort);
  const { data, isLoading, isError } = useSearchTrackQuery({
    searchQuery: (query.query as string) || '',
    sort,
  });

  useEffect(() => {
    dispatch(setCurrentSort(SortTypes.NEWEST));
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <meta name="referrer" content="no-referrer"></meta>
      </Head>
      <Grid container justifyContent="center">
        <Card className="track-list-wrapper">
          {data?.length ? (
            <Box p={3}>
              <h1>Результат поиска</h1>
            </Box>
          ) : (
            <Box p={3}>
              <h1>Ничего не найдено</h1>
            </Box>
          )}
          <TrackList tracks={data} isLoading={isLoading} isError={isError} />
        </Card>
      </Grid>
    </>
  );
};

export default SearchPage;
