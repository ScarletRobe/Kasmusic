import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Grid, TextField, Button, Paper } from '@mui/material';
import UploadStepsWrapper from '@/components/uploadStepsWrapper/UploadStepsWrapper';
import FileUpload from '../../components/FileUpload';
import { AcceptableFiles } from '@/types/track';
import Image from 'next/image';
import { useInput } from '@/hooks/useInput';
import { useCreateTrackMutation } from '@/services/tracksService';

const getUploadStatusElement = (isLoading: boolean, isError: boolean) => {
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  if (!isLoading && !isError) return <div>Success</div>;
};

const Upload = () => {
  const [createPost, { isLoading, isError }] = useCreateTrackMutation();
  const [activeStep, setActiveStep] = useState(0);
  const [picture, setPicture] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const name = useInput('');
  const artist = useInput('');
  const router = useRouter();

  const next = () => {
    setActiveStep((prev) => prev + 1);
    if (activeStep === 2) {
      const formData = new FormData();
      formData.append('name', name.value);
      formData.append('artist', artist.value);
      formData.append('picture', picture as Blob);
      formData.append('audio', audio as Blob);
      createPost(formData);
    }
  };

  const back = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <>
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
                {audio && <audio src={URL.createObjectURL(audio)}></audio>}
                <Button>Загрузить аудио</Button>
              </>
            </FileUpload>
          )}
          {activeStep === 3 && getUploadStatusElement(isLoading, isError)}
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
