import { Snackbar } from '@mui/material';
import React from 'react';

type DefaultSnackbarProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DefaultSnackbar = ({ open, setOpen }: DefaultSnackbarProps) => {
  return (
    <Snackbar
      sx={{
        '& .MuiPaper-root': { display: 'flex', justifyContent: 'center' },
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
      autoHideDuration={1000}
      onClick={(e) => {
        e.stopPropagation();
        setOpen(false);
      }}
      onClose={() => setOpen(false)}
      message="Скопировано в буфер обмена"
    />
  );
};

export default DefaultSnackbar;
