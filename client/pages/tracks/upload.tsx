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
  FormControl,
  FormHelperText,
} from '@mui/material';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import styles from '../../styles/uploadPage.module.css';
import { validate } from '@/helpers/validate';
import WithAuth from '@/components/HOCs/WithAuth';

const DEFAULT_PICTUREINFO = {
  url: 'https://disk.yandex.ru/i/6M-BJiccWbB5Qw',
  name: 'default-image.jpg',
};
let disk: null | YaDisk = null;
const INITIAL = { text: '', error: '' };

const Upload = () => {
  const [createPost, { isLoading, isError, requestId }] =
    useCreateTrackMutation();
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const [picture, setPicture] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const [name, setName] = useState(INITIAL);
  const [artist, setArtist] = useState(INITIAL);

  useEffect(() => {
    if (!disk) {
      disk = new YaDisk(
        'y0_AgAAAAAsPKQhAADLWwAAAADc0R33ojNQVVkHQeKJd60HnYCKSrV6O68',
      );
    }
  });

  useEffect(() => {
    if (requestId && !isLoading) {
      setProgress(100);
    }
  }, [isLoading, requestId]);

  const next = async () => {
    if (activeStep === 0) {
      if (
        [
          validate(
            name.text,
            { notEmpty: true, minLength: 3, maxLength: 30 },
            {
              setErrorMessage: (message: string) =>
                setName((state) => ({ ...state, error: message })),
            },
          ),
          validate(
            artist.text,
            {
              notEmpty: true,
              minLength: 3,
              maxLength: 30,
            },
            {
              setErrorMessage: (message: string) =>
                setArtist((state) => ({ ...state, error: message })),
            },
          ),
        ].some((v) => !v)
      ) {
        return;
      }
    }

    if (activeStep === 2) {
      if (!audio) {
        return;
      }
    }

    setActiveStep((prev) => prev + 1);
    if (activeStep === 2) {
      const formData = new FormData();
      formData.append('name', name.text);
      formData.append('artist', artist.text);
      let pictureUpload;
      if (picture) {
        pictureUpload = uploadFile(disk, picture, 'image');
      }
      const audioUpload = uploadFile(disk, audio, 'audio', setProgress);
      const [pictureInfo, audioInfo] = await Promise.all([
        pictureUpload,
        audioUpload,
      ]);
      setProgress(80);
      if (pictureInfo) {
        formData.append('picture', JSON.stringify(pictureInfo));
      } else {
        formData.append('picture', JSON.stringify(DEFAULT_PICTUREINFO));
      }
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
              <FormControl margin="none" fullWidth error={Boolean(name.error)}>
                <TextField
                  error={Boolean(name.error)}
                  value={name.text}
                  onChange={(e) => setName({ text: e.target.value, error: '' })}
                  label={'Название'}
                />
                <FormHelperText>{name.error || ''}</FormHelperText>
              </FormControl>
              <FormControl
                margin="none"
                fullWidth
                error={Boolean(artist.error)}
              >
                <TextField
                  error={Boolean(artist.error)}
                  value={artist.text}
                  onChange={(e) =>
                    setArtist({ text: e.target.value, error: '' })
                  }
                  label={'Исполнитель'}
                />
                <FormHelperText>{artist.error || ''}</FormHelperText>
              </FormControl>
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
                  <Button>Изменить выбор</Button>
                )}
              </>
            </FileUpload>
          )}
          {activeStep === 3 && progress !== 100 && (
            <Stack
              className={styles.progressWrapper}
              justifyContent="center"
              alignItems="center"
            >
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

export default WithAuth(Upload);
