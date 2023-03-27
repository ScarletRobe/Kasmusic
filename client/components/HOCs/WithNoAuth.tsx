import { AuthorizationStatus } from '@/consts';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useRouter } from 'next/router';

export const WithNoAuth = (Component: React.FC) => {
  const AuthenticatedComponent = () => {
    const router = useRouter();
    const authorizationStatus = useTypedSelector(
      (state) => state.auth.authorizationStatus,
    );
    if (authorizationStatus === AuthorizationStatus.Auth) {
      router.push('/');
      return;
    }

    return <Component />;
  };

  return AuthenticatedComponent;
};

export default WithNoAuth;
