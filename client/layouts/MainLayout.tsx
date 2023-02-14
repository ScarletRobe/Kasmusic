import React from 'react';
import Navbar from '../components/Navbar';
import Container from '@mui/material/Container';

interface MainLayoutProps {
  children: JSX.Element;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Container style={{ marginTop: '90px' }}>{children}</Container>
      {/* TODO: Player */}
    </>
  );
};

export default MainLayout;
