import MainLayout from '@/layouts/MainLayout';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { wrapper } from '../store/store';

import '../styles/global.css';

function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  return (
    <>
      <Head>
        <title>Тестик</title>
        <meta name="referrer" content="no-referrer"></meta>
      </Head>
      <Provider store={store}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </Provider>
    </>
  );
}

export default MyApp;
