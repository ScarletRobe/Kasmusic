import React from 'react';
import Navbar from '../components/Navbar';
import Container from '@mui/material/Container';
import Player from '@/components/Player/Player';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/styles/MUITheme';

interface MainLayoutProps {
  children: JSX.Element;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Navbar />
        <Container style={{ marginTop: '90px', paddingBottom: '65px' }}>
          {children}
        </Container>
        <Player />
      </ThemeProvider>
    </>
  );
};

export default MainLayout;
