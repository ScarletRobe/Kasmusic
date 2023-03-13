import React from 'react';
import Navbar from '../components/Navbar';
import Container from '@mui/material/Container';
import Player from '@/components/Player/Player';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/styles/MUITheme';
import Head from 'next/head';

interface MainLayoutProps {
  children: JSX.Element;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Kasmusic</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="../static/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="../static/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="../static/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="../static/favicon/site.webmanifest" />
      </Head>
      <ThemeProvider theme={theme}>
        <Navbar />
        <Container style={{ marginTop: '90px', paddingBottom: '65px' }}>
          {children}
        </Container>
        <Player />
      </ThemeProvider>
      <div id="stars-container">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
      </div>
    </>
  );
};

export default MainLayout;
