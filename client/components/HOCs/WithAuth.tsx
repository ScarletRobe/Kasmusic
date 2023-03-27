import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useTypedSelector } from '@/hooks/useTypedSelector';

import { AuthorizationStatus } from '@/consts';

export const WithAuth = (Component: React.FC) => {
  const AuthenticatedComponent = () => {
    const router = useRouter();
    const authorizationStatus = useTypedSelector(
      (state) => state.auth.authorizationStatus,
    );

    useEffect(() => {
      if (authorizationStatus === AuthorizationStatus.Unknown) {
        router.push('/');
        return;
      }
      if (authorizationStatus === AuthorizationStatus.NoAuth) {
        router.push('/authorization');
        return;
      }
    }, [authorizationStatus, router]);

    return <Component />; // Render whatever you want while the authentication occurs
  };

  return AuthenticatedComponent;
};

export default WithAuth;
