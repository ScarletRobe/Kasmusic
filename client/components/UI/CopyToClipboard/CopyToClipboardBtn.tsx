import React, { useState } from 'react';

import DefaultSnackbar from '../Snackbars/DefaultSnackbar';

import { ShareRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';

type CopyToClipboardBtnProps = {
  textToCopy: string;
};

const CopyToClipboardBtn = ({ textToCopy }: CopyToClipboardBtnProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DefaultSnackbar {...{ open, setOpen }} />
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
