import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { useSearchTrackQuery } from '@/services/tracksService';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { setCurrentPage, setCurrentSort } from '@/store/appSlice/appSlice';
import { Track } from '@/types/track';
import { SortTypes } from '@/consts';

import TrackList from '@/components/TrackList';
import Searchbar from '@/components/Searchbar';

import { Grid, Card, Box } from '@mui/material';

const SearchPage: React.FC<{ tracks: Track[] }> = () => {
  const { query } = useRouter();
  const dispatch = useDispatch();

  const sort = useTypedSelector((store) => store.app.currentSort);
  const page = useTypedSelector((store) => store.app.currentPage);

  const { data, isError, isFetching } = useSearchTrackQuery({
    searchQuery: (query.query as string) || '',
    sort,
    page,
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
        <Card className="track-list-wrapper" sx={{ p: 3 }}>
          <Searchbar />
          {isFetching ? (
            <h1>Загрузка</h1>
          ) : data?.data.length ? (
            <Box>
              <h1>Результат поиска</h1>
            </Box>
          ) : (
            <Box>
              <h1>Ничего не найдено</h1>
            </Box>
          )}
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

export default SearchPage;
