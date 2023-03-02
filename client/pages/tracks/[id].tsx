import React, { useState } from 'react';
import { Track } from '../../types/track';
import { useRouter } from 'next/router';
import { Button, Grid, TextField } from '@mui/material';
import styles from '../../styles/trackPage.module.css';
import {
  getRunningQueriesThunk,
  getTrackById,
  useCreateCommentMutation,
  useGetTrackByIdQuery,
} from '@/services/tracksService';
import { wrapper } from '@/store/store';
import { useInput } from '@/hooks/useInput';
import { GET_MEDIA_BASE_URL } from '@/consts';

const TrackPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, isError } = useGetTrackByIdQuery(id as string);
  const [createComment] = useCreateCommentMutation();
  const track = data;

  const username = useInput('');
  const text = useInput('');

  const addComment = () => {
    if (track) {
      createComment({
        comment: {
          text: text.value,
          username: username.value,
        },
        trackId: track._id,
      });
    }
  };

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError || !track) {
    return <div>Error</div>;
  }

  return (
    <>
      <Button variant={'outlined'} onClick={() => router.push('/tracks')}>
        К списку
      </Button>
      <Grid container className={styles.trackInfoContainer}>
        <img
          className={styles.trackImg}
          src={GET_MEDIA_BASE_URL + track.picture.url}
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

// Unable to use server side props due to restrictions imposed by the free version of vercel
// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) =>
//     async ({ params }) => {
//       if (!params || !params.id) {
//         return {
//           props: { serverTrack: {} },
//         };
//       }
//       store.dispatch(getTrackById.initiate(params.id as string));
//       const serverTrack = (
//         await Promise.all(store.dispatch(getRunningQueriesThunk()))
//       )[0].data;
//       return {
//         props: { serverTrack },
//       };
//     },
// );
