import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useRouter } from 'next/router';
import { FileUpload } from '@mui/icons-material';
import { Grid, TextField, Button } from '@mui/material';
import UploadStepsWrapper from '@/components/UploadStepsWrapper/UploadStepsWrapper';

const Create = () => {
  const [activeStep, setActiveStep] = useState(0);
  const router = useRouter();

  const next = () => {
    setActiveStep((prev) => prev + 1);
  };

  const back = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <MainLayout>
      <>
        <UploadStepsWrapper activeStep={activeStep}>
          <>
            {activeStep === 0 && (
              <Grid container direction={'column'} style={{ padding: 20 }}>
                <TextField
                  margin="normal"
                  label={'Название'}
                />
                <TextField
                  label={'Исполнитель'}
                />
              </Grid>
            )}

          </>
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
    </MainLayout>
  );
};

export default Create;
