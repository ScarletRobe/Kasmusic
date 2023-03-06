import React from 'react';
import { useRouter } from 'next/router';
import { Grid, Card, Box } from '@mui/material';
import TrackList from '@/components/TrackList';
import { Track } from '@/types/track';
import Head from 'next/head';
import { useSearchTrackQuery } from '@/services/tracksService';

const Index: React.FC<{ tracks: Track[] }> = () => {
  const { query } = useRouter();
  const { data, isLoading, isError } = useSearchTrackQuery(
    (query.query as string) || '',
  );

  return (
    <>
      <Head>
        <meta name="referrer" content="no-referrer"></meta>
      </Head>
      <Grid container justifyContent="center">
        <Card className="track-list-wrapper">
          <TrackList
            tracks={data}
            isLoading={isLoading}
            isError={isError}
            withoutSort
          />
        </Card>
      </Grid>
    </>
  );
};

export default Index;
