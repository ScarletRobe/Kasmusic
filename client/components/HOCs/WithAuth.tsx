import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useTypedSelector } from '@/hooks/useTypedSelector';

import { AuthorizationStatus, PageRoutes } from '@/consts';

export const WithAuth = (Component: React.FC) => {
  const AuthenticatedComponent = () => {
    const router = useRouter();
    const authorizationStatus = useTypedSelector(
      (state) => state.auth.authorizationStatus,
    );

    useEffect(() => {
      if (authorizationStatus === AuthorizationStatus.Unknown) {
        router.push(PageRoutes.Home);
        return;
      }
      if (authorizationStatus === AuthorizationStatus.NoAuth) {
        router.push(PageRoutes.Authorization);
        return;
      }
    }, [authorizationStatus, router]);

    return <Component />;
  };

  return AuthenticatedComponent;
};

export default WithAuth;
