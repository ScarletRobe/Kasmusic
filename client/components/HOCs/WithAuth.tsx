import { AuthorizationStatus } from '@/consts';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useRouter } from 'next/router';

export const WithAuth = (Component: React.FC) => {
  const AuthenticatedComponent = () => {
    const router = useRouter();
    const authorizationStatus = useTypedSelector(
      (state) => state.auth.authorizationStatus,
    );
    if (authorizationStatus === AuthorizationStatus.Unknown) {
      router.push('/');
      return;
    }
    if (authorizationStatus === AuthorizationStatus.NoAuth) {
      router.push('/authorization');
      return;
    }

    return <Component />; // Render whatever you want while the authentication occurs
  };

  return AuthenticatedComponent;
};

export default WithAuth;
