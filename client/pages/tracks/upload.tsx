import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { AcceptableFiles } from '@/types/track';
import { useInput } from '@/hooks/useInput';
import { useCreateTrackMutation } from '@/services/tracksService';
import { uploadFile, YaDisk } from '../../services/yandexDiskApi';

import UploadStepsWrapper from '@/components/uploadStepsWrapper/UploadStepsWrapper';
import FileUpload from '../../components/FileUpload';

import {
  Grid,
  TextField,
  Button,
  Paper,
  LinearProgress,
  Stack,
} from '@mui/material';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import styles from '../../styles/uploadPage.module.css';

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
        <Paper elevation={3} sx={{ p: 3 }} className={styles.wrapper}>
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
            <Stack justifyContent="center" alignItems="center">
              <div>Загружаем</div>
              <LinearProgress
                className={styles.progress}
                variant="determinate"
                value={progress}
              />
            </Stack>
          )}
          {activeStep === 3 &&
            progress === 100 &&
            (!isError ? (
              <Stack justifyContent="center" alignItems="center">
                <DoneRoundedIcon htmlColor="green" fontSize="large" />
                <div>Ваш трек успешно загружен</div>
                <Button
                  className={styles.link}
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
                  className={styles.link}
                  onClick={() => router.push('/tracks')}
                >
                  Вернуться к списку
                </Button>
              </Stack>
            ))}
        </Paper>
      </UploadStepsWrapper>
      <Grid container justifyContent="space-between">
        <Button
          color="secondary"
          className={styles.btn}
          disabled={activeStep === 0 || activeStep === 3}
          onClick={back}
        >
          Назад
        </Button>
        <Button
          color="secondary"
          className={styles.btn}
          disabled={activeStep === 3}
          onClick={next}
        >
          {activeStep < 2 ? 'Далее' : 'Загрузить'}
        </Button>
      </Grid>
    </>
  );
};

export default Upload;
