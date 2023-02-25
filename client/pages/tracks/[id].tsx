import React, { useState } from 'react';
import { Track } from '../../types/track';
import { useRouter } from 'next/router';
import { Button, Grid, TextField } from '@mui/material';
import styles from '../../styles/trackPage.module.css';
import {
  getRunningQueriesThunk,
  getTrackById,
  useCreateCommentMutation,
} from '@/services/tracksService';
import { wrapper } from '@/store/store';
import { useInput } from '@/hooks/useInput';

type TrackPageProps = {
  serverTrack: Track;
};

const TrackPage: React.FC<TrackPageProps> = ({ serverTrack }) => {
  const [track, setTrack] = useState<Track>(serverTrack);
  const [prevReqId, setPrevReqId] = useState<null | string>(null);
  const router = useRouter();
  const username = useInput('');
  const text = useInput('');

  const [createComment, result] = useCreateCommentMutation();

  if (result.status === 'fulfilled' && result.requestId !== prevReqId) {
    setTrack({ ...track, comments: [...track.comments, result.data] });
    setPrevReqId(result.requestId);
  }

  const addComment = () => {
    createComment({
      comment: {
        text: text.value,
        username: username.value,
      },
      trackId: track._id,
    });
  };
  return (
    <>
      <Button variant={'outlined'} onClick={() => router.push('/tracks')}>
        К списку
      </Button>
      <Grid container className={styles.trackInfoContainer}>
        <img
          className={styles.trackImg}
          src={track.picture.url}
          width={200}
          height={200}
          alt="Track cover"
        />
        <div className={styles.trackInfo}>
          <h1>{track.name}</h1>
          <h1>Исполнитель: {track.artist}</h1>
          <h1>Прослушиваний: {track.listens}</h1>
        </div>
      </Grid>
      <h2>Добавить комментарий</h2>
      <Grid container>
        <TextField
          {...username}
          label="Ваше имя"
          fullWidth
          inputProps={{ maxLength: 100 }}
        />
        <TextField
          {...text}
          margin="normal"
          label="Комментарий"
          multiline
          fullWidth
          rows={4}
          inputProps={{ maxLength: 250 }}
        />
      </Grid>
      <Button variant="outlined" onClick={addComment}>
        Отправить
      </Button>
      <h2>Комментарии</h2>
      <div>
        {track.comments.map((comment) => (
          <div key={comment._id}>
            <div>Автор - {comment.username}</div>
            <div>Комментарий - {comment.text}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TrackPage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params }) => {
      if (!params || !params.id) {
        return {
          props: { serverTrack: {} },
        };
      }
      store.dispatch(getTrackById.initiate(params.id as string));
      const serverTrack = (
        await Promise.all(store.dispatch(getRunningQueriesThunk()))
      )[0].data;
      return {
        props: { serverTrack },
      };
    },
);
