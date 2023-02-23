import React from 'react';
import { useRouter } from 'next/router';
import { Grid, Card, Box, Button } from '@mui/material';
import TrackList from '@/components/TrackList';
import { Track } from '@/types/track';
import Head from 'next/head';

const Index: React.FC<{ tracks: Track[] }> = () => {
  const router = useRouter();

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
          <TrackList />
        </Card>
      </Grid>
    </>
  );
};

export default Index;
