import React, { useState } from 'react';
import { useDeleteTrackMutation } from '@/services/tracksService';
import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import AlertSnackbar from '../Snackbars/AlertSnackbar';

type DeleteBtnProps = {
  trackId: string;
};

const DeleteBtn = ({ trackId }: DeleteBtnProps) => {
  const [open, setOpen] = useState(false);
  const [deleteTrack] = useDeleteTrackMutation();
  const [message, setMessage] = useState('');

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      await deleteTrack(trackId).unwrap();
    } catch (error) {
      setMessage((error as any).data.message);
      setOpen(true);
    }
  };

  return (
    <>
      <AlertSnackbar
        open={open}
        setClose={() => setOpen(false)}
        message={message}
        severity="error"
      />
      <IconButton onClick={(e) => handleDelete(e)}>
        <Delete />
      </IconButton>
    </>
  );
};

export default DeleteBtn;
