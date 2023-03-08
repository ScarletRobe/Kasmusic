import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

const Index = () => {
  const router = useRouter();
  return (
    <>
      <Stack
        className="main-page-content"
        justifyContent="center"
        alignItems="center"
      >
        <div className="animated-text">KASMUSIC</div>
        <button
          className="main-page-btn"
          onClick={() => router.push('/tracks')}
        >
          <svg className="main-page-btn-svg" viewBox="0 0 1320 300">
            <text
              className="main-page-btn-text"
              x="50%"
              y="50%"
              dy=".35em"
              textAnchor="middle"
            >
              К списку музыки
            </text>
          </svg>
        </button>
      </Stack>
    </>
  );
};

export default Index;
