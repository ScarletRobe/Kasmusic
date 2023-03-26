import * as React from 'react';

import PasswordField from './textFields/PasswordField';
import UsernameField from './textFields/UsernameField';

import { Box, FormControl, Button } from '@mui/material';
import { validate } from '@/helpers/validate';
import { useSignInMutation } from '@/services/authService';

const INITIAL = { text: '', error: '' };

const SignIn = () => {
  const [username, setUsername] = React.useState(INITIAL);
  const [password, setPassword] = React.useState(INITIAL);
  const [loading, setLoading] = React.useState(false);

  const [signIn] = useSignInMutation();

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
      console.log(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};
export default SignIn;
