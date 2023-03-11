import React from 'react';
import { useRouter } from 'next/router';

import { wrapper } from '@/store/store';
import { EditableFields, Track } from '../../types/track';
import { useInput } from '@/hooks/useInput';
import { GET_MEDIA_BASE_URL } from '@/consts';
import {
  getRunningQueriesThunk,
  getTrackById,
  useCreateCommentMutation,
  useEditTrackMutation,
  useGetTrackByIdQuery,
} from '@/services/tracksService';

import { Button, Card, Grid, TextField } from '@mui/material';

import styles from '../../styles/trackPage.module.css';
import EditableText from '@/components/EditableText';
import { Stack } from '@mui/system';

export type EditTrackInfoParams = {
  field: EditableFields;
  newValue: string;
};

const TrackPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, isError } = useGetTrackByIdQuery(id as string);
  const [createComment] = useCreateCommentMutation();
  const [editTrack] = useEditTrackMutation();

  const track = data;

  const username = useInput('');
  const text = useInput('');

  const editTrackInfo = ({ field, newValue }: EditTrackInfoParams) => {
    if (track) {
      editTrack({ id: track._id, field, newValue });
    }
  };

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
      <Card sx={{ p: 3 }}>
        <Button variant={'outlined'} onClick={() => router.push('/tracks')}>
          К списку
        </Button>
        <Grid container gap={3} className={styles.trackInfoContainer}>
          <img
            className={styles.trackImg}
            src={GET_MEDIA_BASE_URL + track.picture.url}
            width={200}
            height={200}
            alt="Track cover"
          />
          <Stack gap={3} className={styles.trackInfo}>
            <EditableText
              text={track.name}
              fieldName={EditableFields.NAME}
              action={editTrackInfo}
            />
            <Stack direction="row" gap={1}>
              <h1 className={styles.trackHeader}>Исполнитель:</h1>
              <EditableText
                text={`${track.artist}`}
                fieldName={EditableFields.ARTIST}
                action={editTrackInfo}
              />
            </Stack>
            <h1 className={styles.trackHeader}>
              Прослушиваний: {track.listens}
            </h1>
          </Stack>
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
      </Card>
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
