import React from 'react';
import { useRouter } from 'next/router';

import { PageRoutes } from '@/consts';

import { Stack } from '@mui/material';
import Head from 'next/head';

const Index = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Kasmusic</title>
        <meta name="description" content="Music platform" />
      </Head>
      <Stack
        className="main-page-content"
        justifyContent="center"
        alignItems="center"
      >
        <div className="animated-text">KASMUSIC</div>
        <button
          className="main-page-btn"
          onClick={() => router.push(PageRoutes.Tracks)}
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
