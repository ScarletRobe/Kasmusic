import MainLayout from '@/layouts/MainLayout';
import { Provider } from 'react-redux';
import { wrapper } from '../store/store';

import '../styles/global.css';

function MyApp({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  return (
    <Provider store={store}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </Provider>
  );
}

export default MyApp;
