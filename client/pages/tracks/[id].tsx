import React, { useState } from 'react';
import { Track } from '../../types/track';
import MainLayout from '../../layouts/MainLayout';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { Button, Grid, TextField } from '@mui/material';
import Image from 'next/image';

type TrackPageProps = {
  serverTrack: Track;
};

const TrackPage: React.FC<TrackPageProps> = ({
  serverTrack = {
  },
}) => {
  const router = useRouter();

  return (
    <MainLayout
    >
      <>
        <Button variant={'outlined'} onClick={() => router.push('/tracks')}>
          К списку
        </Button>
        <Grid container style={{ margin: '20px 0' }}>
          <Image
            src=""
            width={200}
            height={200}
            alt="Track cover"
          />
          <div style={{ marginLeft: 30 }}>
            <h1>{track.name}</h1>
            <h1>Исполнитель: {track.artist}</h1>
            <h1>Прослушиваний: {track.listens}</h1>
          </div>
        </Grid>
        <h2>Добавить комментарий</h2>
        <Grid container>
            label="Ваше имя"
            fullWidth
            inputProps={{ maxLength: 100 }}
          />
          <TextField
            margin="normal"
            label="Комментарий"
            multiline
            rows={4}
            inputProps={{ maxLength: 250 }}
          />
          <Button
          >
            Отправить
          </Button>
        </Grid>
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
    </MainLayout>
  );
};

export default TrackPage;
