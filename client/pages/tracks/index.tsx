import React from 'react';
import { useRouter } from 'next/router';
import { Grid, Card, Box, Button } from '@mui/material';
import TrackList from '@/components/TrackList';
import { wrapper } from '@/store/store';
import { getAllTracks, getRunningQueriesThunk } from '@/services/tracksService';
import { GetTracksParams, Track } from '@/types/track';

const Index: React.FC<{ tracks: Track[] }> = ({ tracks }) => {
  const router = useRouter();

  return (
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
        <TrackList tracks={tracks} />
      </Card>
    </Grid>
  );
};

export default Index;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    store.dispatch(getAllTracks.initiate({} as GetTracksParams));
    const tracks = (
      await Promise.all(store.dispatch(getRunningQueriesThunk()))
    )[0].data;
    return {
      props: { tracks },
    };
  },
);
