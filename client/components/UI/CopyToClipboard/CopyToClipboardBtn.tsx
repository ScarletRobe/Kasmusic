import React, { useState } from 'react';

import { ShareRounded } from '@mui/icons-material';
import { IconButton, Snackbar } from '@mui/material';

type CopyToClipboardBtnProps = {
  textToCopy: string;
};

const CopyToClipboardBtn = ({ textToCopy }: CopyToClipboardBtnProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
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
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
          navigator.clipboard.writeText(textToCopy);
        }}
      >
        <ShareRounded />
      </IconButton>
    </>
  );
};

export default CopyToClipboardBtn;
