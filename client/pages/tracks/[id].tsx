import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { wrapper } from '@/store/store';
import dayjs from 'dayjs';

import { EditableFields, Track } from '../../types/track';
import { GET_MEDIA_BASE_URL, PageRoutes } from '@/consts';

import {
  getRunningQueriesThunk,
  getTrackById,
  useCreateCommentMutation,
  useEditTrackMutation,
  useGetTrackByIdQuery,
} from '@/services/tracksService';

import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useSetActiveTrack } from '@/hooks/useSetActiveTrack';

import Loader from '@/components/Loaders/Loader';
import EditableText from '@/components/EditableText';
import Comment from '@/components/comment/Comment';
import CreateComment from '@/components/comment/CreateComment';

import { PlayArrow, Pause, CloseRounded } from '@mui/icons-material';
import { Avatar, Box, Button, Card, Grid, Typography } from '@mui/material';
import { Stack } from '@mui/system';

import styles from '../../styles/trackPage.module.css';
import LikeBtn from '@/components/UI/LikeBtn/LikeBtn';

export type EditTrackInfoParams = {
  field: EditableFields;
  newValue: string;
};

const TrackPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const activeTrack = useTypedSelector((state) => state.player.activeTrack);
  const pause = useTypedSelector((state) => state.player.pause);

  const { data, isLoading, isError } = useGetTrackByIdQuery(id as string);
  const [editTrack] = useEditTrackMutation();

  const { setTrack, play } = useSetActiveTrack();

  const track = data;

  useEffect(() => {
    if (!track) {
      return;
    }
    setTrack(track);
  }, [isLoading]);

  const editTrackInfo = ({ field, newValue }: EditTrackInfoParams) => {
    if (track) {
      editTrack({ id: track._id, field, newValue });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Loader />
      </div>
    );
  }
  if (isError || !track) {
    return (
      <Card sx={{ p: 3 }}>
        <Stack justifyContent="center" alignItems="center">
          <CloseRounded htmlColor="red" fontSize="large" />
          <div>При загрузке произошла ошибка</div>
          <div>Попробуйте позже</div>
          <Button
            className={styles.link}
            onClick={() => router.push(PageRoutes.Tracks)}
          >
            Вернуться к списку
          </Button>
        </Stack>
      </Card>
    );
  }

  return (
    <>
      <Head>
        <meta name="referrer" content="no-referrer"></meta>
      </Head>
      <Card sx={{ p: 3 }}>
        <Button
          variant={'outlined'}
          onClick={() => router.push(PageRoutes.Tracks)}
        >
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
        <Stack direction="row" gap={1} my={2}>
          <Button
            onClick={play}
            variant="outlined"
            startIcon={
              activeTrack?._id === track._id && !pause ? (
                <Pause />
              ) : (
                <PlayArrow />
              )
            }
          >
            {activeTrack?._id === track._id && !pause
              ? 'Остановить'
              : 'Слушать'}
          </Button>
          <LikeBtn
            trackId={track._id}
            variant="button"
            likesCount={track.likes}
          />
        </Stack>
        <Stack gap={2}>
          <Stack>
            <Card sx={{ py: '5px', px: '10px' }}>
              <Typography variant="h5" sx={{ mb: '10px' }}>
                Дополнительная информация
              </Typography>
              <Box pl={2}>
                {track.author && (
                  <Stack direction="row" gap={1}>
                    <Typography
                      variant="h6"
                      className={styles.additionalInfoAuthor}
                    >
                      Загрузил:
                    </Typography>
                    <Typography
                      variant="h6"
                      className={styles.additionalInfoAuthor}
                    >
                      {track.author.username}
                    </Typography>
                    <Avatar src={track.author.avatarLink} alt="Аватар"></Avatar>
                  </Stack>
                )}
                <Typography variant="h6">{`Дата загрузки ${dayjs(
                  track.createdAt,
                ).format('DD.MM.YYYY')}`}</Typography>
              </Box>
            </Card>
          </Stack>
          <Card sx={{ py: '5px', px: '10px' }}>
            <Typography variant="h5" sx={{ mb: '10px' }}>
              Добавить комментарий
            </Typography>
            <Box pl={2}>
              <CreateComment trackId={track._id} />
            </Box>
          </Card>
          {Boolean(track.comments.length) && (
            <Card sx={{ py: '5px', px: '10px' }}>
              <Typography variant="h5" sx={{ mb: '10px' }}>
                Комментарии
              </Typography>
              <Box pl={2}>
                {track.comments.map((comment) => (
                  <Comment key={comment._id} comment={comment} />
                ))}
              </Box>
            </Card>
          )}
        </Stack>
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
