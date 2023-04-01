import Searchbar from '@/components/Searchbar';
import { Grid, Card } from '@mui/material';
import React from 'react';

const index = () => {
  return (
    <Grid container justifyContent="center">
      <Card className="track-list-wrapper" sx={{ p: 3 }}>
        <Searchbar />
      </Card>
    </Grid>
  );
};

export default index;
