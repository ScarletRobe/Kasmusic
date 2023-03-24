import React from 'react';

import AuthTabs from '@/components/authorization/AuthTabs';

import { Box, Grid } from '@mui/material';

const index = () => {
  return (
    <Box height="100%">
      <Grid container>
        <Grid item xs={false} md={4} />
        <Grid item xs={12} md={4}>
          <Box p={2} boxShadow={2} bgcolor="white">
            <AuthTabs />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default index;
