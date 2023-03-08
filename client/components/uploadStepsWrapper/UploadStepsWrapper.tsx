import React from 'react';
import styles from './UploadStepsWrapper.module.css';

import { Card, Container, Grid, Step, StepLabel, Stepper } from '@mui/material';

interface StepWrapperProps {
  activeStep: number;
  children: JSX.Element;
}
const STEPS = ['Информация о треке', 'Обложка', 'Аудио'];

const UploadStepsWrapper: React.FC<StepWrapperProps> = ({
  activeStep,
  children,
}) => {
  return (
    <Container>
      <Stepper activeStep={activeStep}>
        {STEPS.map((step, index) => (
          <Step key={index} completed={activeStep > index}>
            <StepLabel
              sx={{
                color: 'white',
                '& .MuiStepLabel-label': { color: '#787878' },
                '& .MuiStepLabel-label.Mui-active': { color: '#fff' },
                '& .MuiStepLabel-label.Mui-completed': { color: '#787878' },
                '& .MuiSvgIcon-fontSizeMedium': { color: '#787878' },
                '& .MuiSvgIcon-fontSizeMedium.Mui-active': { color: '#673ab7' },
              }}
            >
              {step}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Grid
        container
        justifyContent="center"
        className={styles.uploadCardWrapper}
      >
        <Card className={styles.uploadCard}>{children}</Card>
      </Grid>
    </Container>
  );
};

export default UploadStepsWrapper;
