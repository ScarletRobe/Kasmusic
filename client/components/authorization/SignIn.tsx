import { useState } from 'react';
import { useRouter } from 'next/router';

import AlertSnackbar from '../UI/Snackbars/AlertSnackbar';
import PasswordField from './textFields/PasswordField';
import UsernameField from './textFields/UsernameField';

import { validate } from '@/helpers/validate';
import { useSignInMutation } from '@/services/authService';

import { Box, FormControl, Button } from '@mui/material';

const INITIAL = { text: '', error: '' };

const SignIn = () => {
  const [signIn] = useSignInMutation();
  const router = useRouter();

  const [username, setUsername] = useState(INITIAL);
  const [password, setPassword] = useState(INITIAL);
  const [error, setError] = useState({ isError: false, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      [
        validate(
          username.text,
          { notEmpty: true, maxLength: 30, minLength: 3 },
          {
            setErrorMessage: (message: string) =>
              setUsername((state) => ({ ...state, error: message })),
          },
        ),
        validate(
          password.text,
          { notEmpty: true, maxLength: 30, minLength: 3 },
          {
            setErrorMessage: (message: string) =>
              setPassword((state) => ({ ...state, error: message })),
          },
        ),
      ].some((v) => !v)
    ) {
      return;
    }
    try {
      setLoading(true);
      const result = await signIn({
        username: username.text,
        password: password.text,
      }).unwrap();
      setPassword(INITIAL);
      setUsername(INITIAL);
      if (!result.user.isActivated) {
        router.push('/authorization/activation');
      }
    } catch (error) {
      setError({
        isError: true,
        message: (error as any).data.message || '',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertSnackbar
        open={error.isError}
        setClose={() => setError({ isError: false, message: '' })}
        message={error.message}
        severity="error"
      />
      <Box p={2}>
        <UsernameField {...{ username, setUsername, loading }} />
        <PasswordField {...{ password, setPassword, loading }} />

        <FormControl margin="normal" fullWidth>
          <Button
            style={{ textTransform: 'none' }}
            size="large"
            disabled={loading}
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Войти
          </Button>
        </FormControl>
      </Box>
    </>
  );
};
export default SignIn;
