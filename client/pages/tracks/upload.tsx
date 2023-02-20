import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useRouter } from 'next/router';
import { Grid, TextField, Button, Paper } from '@mui/material';
import UploadStepsWrapper from '@/components/uploadStepsWrapper/UploadStepsWrapper';
import FileUpload from '../../components/FileUpload';
import { AcceptableFiles } from '@/types/track';

const Upload = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [picture, setPicture] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const router = useRouter();

  const next = () => {
    setActiveStep((prev) => prev + 1);
  };

  const back = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
      <>
        <UploadStepsWrapper activeStep={activeStep}>
          <Paper
            elevation={3}
            sx={activeStep === 3 ? { filter: 'blur(1px)', p: 3 } : { p: 3 }}
          >
            {activeStep === 0 && (
              <Grid container direction={'column'} rowGap={2}>
                <TextField
                  margin="normal"
                  label={'Название'}
                />
                <TextField
                  label={'Исполнитель'}
                />
              </Grid>
            )}

            {activeStep === 1 && (
              <FileUpload setFile={setPicture} accept={AcceptableFiles.IMAGE}>
                <Button>Загрузить изображение</Button>
              </FileUpload>
            )}
            {activeStep === 2 && (
              <FileUpload setFile={setAudio} accept={AcceptableFiles.AUDIO}>
                <Button>Загрузить аудио</Button>
              </FileUpload>
            )}
          </Paper>
        </UploadStepsWrapper>
        <Grid container justifyContent="space-between">
          <Button
            disabled={activeStep === 0 || activeStep === 3}
            onClick={back}
          >
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
