import { Card, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

const activation = () => {
  return (
    <Card
      sx={{
        position: ' absolute',
        textAlign: 'center',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '750px',
        maxHeight: '200px',
        height: '100%',
        width: '100%',
      }}
    >
      <Box>
        <Typography variant="h6" textAlign="center" color="black">
          На вашу почту было отправлено письмо для подтверждения аккаунта
        </Typography>
      </Box>
    </Card>
  );
};

export default activation;
