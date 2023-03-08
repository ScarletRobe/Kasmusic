import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Grid, TextField, Button, Paper } from '@mui/material';
import UploadStepsWrapper from '@/components/uploadStepsWrapper/UploadStepsWrapper';
import FileUpload from '../../components/FileUpload';
import { AcceptableFiles } from '@/types/track';
import Image from 'next/image';
import { useInput } from '@/hooks/useInput';
import { useCreateTrackMutation } from '@/services/tracksService';
import Head from 'next/head';
import { uploadFile, YaDisk } from '../../services/yandexDiskApi';

import {
  Grid,
  TextField,
  Button,
  Paper,
  LinearProgress,
  Stack,
} from '@mui/material';

let disk: null | YaDisk = null;
const Upload = () => {
  useEffect(() => {
    if (!disk) {
      disk = new YaDisk(
        'y0_AgAAAAAsPKQhAADLWwAAAADc0R33ojNQVVkHQeKJd60HnYCKSrV6O68',
      );
    }
  });

  const [createPost, { isLoading, isError, requestId }] =
    useCreateTrackMutation();
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const [picture, setPicture] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const name = useInput('');
  const artist = useInput('');
  useEffect(() => {
    if (requestId && !isLoading) {
      setProgress(100);
    }
  }, [isLoading, requestId]);

  const next = async () => {
    setActiveStep((prev) => prev + 1);
    if (activeStep === 2) {
      const formData = new FormData();
      formData.append('name', name.value);
      formData.append('artist', artist.value);
      const pictureUpload = uploadFile(disk, picture, 'image');
      const audioUpload = uploadFile(disk, audio, 'audio', setProgress);
      const [pictureInfo, audioInfo] = await Promise.all([
        pictureUpload,
        audioUpload,
      ]);
      setProgress(80);
      formData.append('picture', JSON.stringify(pictureInfo));
      formData.append('audio', JSON.stringify(audioInfo));
      createPost(formData);
      setProgress(90);
    }
  };

  const back = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <>
      <Head>
        <meta name="referrer" content="always"></meta>
      </Head>
      <UploadStepsWrapper activeStep={activeStep}>
        <Paper elevation={3} sx={{ p: 3 }}>
          {activeStep === 0 && (
            <Grid container direction={'column'} rowGap={2}>
              <TextField {...name} label={'Название'} />
              <TextField {...artist} label={'Исполнитель'} />
            </Grid>
          )}

          {activeStep === 1 && (
            <FileUpload setFile={setPicture} accept={AcceptableFiles.IMAGE}>
              <>
                {picture && (
                  <img
                    width={70}
                    height={70}
                    src={URL.createObjectURL(picture)}
                  ></img>
                )}
                <Button>Загрузить изображение</Button>
              </>
            </FileUpload>
          )}
          {activeStep === 2 && (
            <FileUpload setFile={setAudio} accept={AcceptableFiles.AUDIO}>
              <>
                {!audio ? (
                <Button>Загрузить аудио</Button>
                ) : (
                  <Button>Выбрать другое</Button>
                )}
              </>
            </FileUpload>
          )}
          {activeStep === 3 && progress !== 100 && (
            <LinearProgress variant="determinate" value={progress} />
          )}
          {activeStep === 3 &&
            progress === 100 &&
            (isError ? (
              <Stack justifyContent="center" alignItems="center">
                <DoneRoundedIcon htmlColor="green" fontSize="large" />
                <div>Ваш трек успешно загружен</div>
                <Button
          {activeStep === 3 && getUploadStatusElement(isLoading, isError)}
                  onClick={() => router.push('/tracks')}
                >
                  Вернуться к списку
                </Button>
              </Stack>
            ) : (
              <Stack justifyContent="center" alignItems="center">
                <CloseRoundedIcon htmlColor="red" fontSize="large" />
                <div>При загрузке произошла ошибка</div>
                <div>Попробуйте позже</div>
                <Button
                  onClick={() => router.push('/tracks')}
                >
                  Вернуться к списку
                </Button>
              </Stack>
            ))}
        </Paper>
      </UploadStepsWrapper>
      <Grid container justifyContent="space-between">
        <Button disabled={activeStep === 0 || activeStep === 3} onClick={back}>
          Назад
        </Button>
        <Button disabled={activeStep === 3} onClick={next}>
          {activeStep < 2 ? 'Далее' : 'Загрузить'}
        </Button>
      </Grid>
    </>
  );
};

export default Upload;
