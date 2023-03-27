import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useTypedSelector } from '@/hooks/useTypedSelector';

import { AuthorizationStatus } from '@/consts';

export const WithNoAuth = (Component: React.FC) => {
  const AuthenticatedComponent = () => {
    const router = useRouter();
    const authorizationStatus = useTypedSelector(
      (state) => state.auth.authorizationStatus,
    );

    useEffect(() => {
      if (authorizationStatus === AuthorizationStatus.Auth) {
        router.push('/');
        return;
      }
    }, [authorizationStatus, router]);

    return <Component />;
  };

  return AuthenticatedComponent;
};

export default WithNoAuth;
