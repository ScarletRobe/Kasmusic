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
            <StepLabel>{step}</StepLabel>
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
