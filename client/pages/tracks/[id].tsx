import React from 'react';
import { Track } from '../../types/track';
import { useRouter } from 'next/router';
import { Button, Grid, TextField } from '@mui/material';
import styles from '../../styles/trackPage.module.css';
import { getRunningQueriesThunk, getTrackById } from '@/services/tracksService';
import { wrapper } from '@/store/store';

type TrackPageProps = {
  track: Track;
};

const TrackPage: React.FC<TrackPageProps> = ({ track }) => {
  const router = useRouter();

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
        <TextField label="Ваше имя" fullWidth inputProps={{ maxLength: 100 }} />
        <TextField
          margin="normal"
          label="Комментарий"
          multiline
          fullWidth
          rows={4}
          inputProps={{ maxLength: 250 }}
        />
      </Grid>
      <Button variant="outlined">Отправить</Button>
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
          props: { track: {} },
        };
      }
      store.dispatch(getTrackById.initiate(params.id as string));
      const track = (
        await Promise.all(store.dispatch(getRunningQueriesThunk()))
      )[0].data;
      return {
        props: { track },
      };
    },
);
