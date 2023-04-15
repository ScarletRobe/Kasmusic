import React, { useState } from 'react';
import Link from 'next/link';

import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useCreateCommentMutation } from '@/services/tracksService';

import { AuthorizationStatus, PageRoutes } from '@/consts';

import {
  Grid,
  TextField,
  Button,
  Stack,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { validate } from '@/helpers/validate';

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
  const [error, setError] = useState('');

  const addComment = () => {
    if (user) {
      try {
        if (
          !validate(
            text,
            { notEmpty: true, maxLength: 500 },
            { setErrorMessage: (message: string) => setError(message) },
          )
        ) {
          return;
        }
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
      <FormControl fullWidth error={Boolean(error)}>
        <TextField
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError('');
          }}
          label="Комментарий"
          multiline
          fullWidth
          rows={4}
          inputProps={{ maxLength: 500 }}
        />
        <FormHelperText>{error || ' '}</FormHelperText>
      </FormControl>
      <Button variant="outlined" onClick={addComment}>
        Отправить
      </Button>
    </Grid>
  );
};

export default CreateComment;
