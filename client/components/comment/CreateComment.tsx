import React, { useState } from 'react';
import Link from 'next/link';

import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useCreateCommentMutation } from '@/services/tracksService';

import { AuthorizationStatus, PageRoutes } from '@/consts';

import { Grid, TextField, Button, Stack } from '@mui/material';

type CreateCommentProps = {
  trackId: string;
};

const CreateComment = ({ trackId }: CreateCommentProps) => {
  const [createComment] = useCreateCommentMutation();

  const authorizationStatus = useTypedSelector(
    (state) => state.auth.authorizationStatus,
  );
  const user = useTypedSelector((state) => state.auth.user);

  const [text, setText] = useState('');

  const addComment = () => {
    if (user) {
      try {
        createComment({
          comment: {
            text: text,
            user: user.id,
          },
          trackId,
        }).unwrap();
        setText('');
      } catch (error) {
        return;
      }
    }
  };

  if (authorizationStatus !== AuthorizationStatus.Auth) {
    return (
      <Stack direction="row" justifyContent="center">
        <Link href={PageRoutes.Authorization}>
          Авторизируйтесь для того чтобы оставлять комментарии
        </Link>
      </Stack>
    );
  }

  return (
    <Grid container>
      <TextField
        value={text}
        onChange={(e) => setText(e.target.value)}
        margin="normal"
        label="Комментарий"
        multiline
        fullWidth
        rows={4}
        inputProps={{ maxLength: 500 }}
      />
      <Button variant="outlined" onClick={addComment}>
        Отправить
      </Button>
    </Grid>
  );
};

export default CreateComment;
