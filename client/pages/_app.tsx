import { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import { refresh } from '@/services/authService';
import { setCredentials, signOut } from '@/store/authSlice/authSlice';
import { wrapper } from '../store/store';

import MainLayout from '@/layouts/MainLayout';

import '../styles/global.css';
import { useEffect } from 'react';

function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      store
        .dispatch(refresh.initiate(''))
        .then(({ data }) => {
          if (data.user.isActivated) {
            store.dispatch(
              setCredentials({ user: data.user, token: data.accessToken }),
            );
          }
        })
        .catch(() => store.dispatch(signOut()));
    }
  }, []);

  const { pageProps } = props;
  return (
    <>
      <Provider store={store}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </Provider>
    </>
  );
}

export default MyApp;
