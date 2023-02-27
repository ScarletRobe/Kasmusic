import React, { useState } from 'react';

import TrackItem from './TrackItem/TrackItem';

import { Grid, Box } from '@mui/material';

import { useGetAllTracksQuery } from '@/services/tracksService';
import Searchbar from './Searchbar';
import { Track } from '@/types/track';

const TrackList: React.FC = () => {
  const [prevReqId, setPrevReqId] = useState<null | string>(null);
  const { data, isLoading, isError, status, requestId } = useGetAllTracksQuery({
    count: '50',
    offset: '0',
  });
  const [tracks, setTracks] = useState<null | Track[]>(null);

  if (status === 'fulfilled' && requestId && requestId !== prevReqId) {
    if (data) {
      setTracks(data);
    }
    setPrevReqId(requestId);
  }

  if (isLoading) return <div>Loading</div>;
  if (isError || !tracks) return <div>Error</div>;

  return (
    <>
      <Box pl={4} pr={4}>
        <Searchbar setTracks={setTracks} />
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
