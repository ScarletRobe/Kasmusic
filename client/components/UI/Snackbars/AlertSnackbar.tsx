import { Snackbar, Alert, AlertColor } from '@mui/material';
import React from 'react';

type AlertSnackbarProps = {
  open: boolean;
  setClose: () => void;
  message: string;
  severity: AlertColor;
};

const AlertSnackbar = ({
  open,
  setClose,
  message,
  severity,
}: AlertSnackbarProps) => {
  return (
    <Snackbar
      sx={{
        '& .MuiPaper-root': { display: 'flex', justifyContent: 'center' },
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
      autoHideDuration={6000}
      onClose={(e) => {
        e?.stopPropagation();
        setClose();
      }}
    >
      <Alert onClose={setClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;
