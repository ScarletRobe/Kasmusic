import React, { useState } from 'react';

import { validate } from '@/helpers/validate';
import { useSignUpMutation } from '@/services/authService';

import EmailField from './textFields/EmailField';
import PasswordField from './textFields/PasswordField';
import UsernameField from './textFields/UsernameField';

import { Box, FormControl, Button } from '@mui/material';

const INITIAL = { text: '', error: '' };

const SignUp: React.FC = () => {
  const [signUp] = useSignUpMutation();

  const [username, setUsername] = useState(INITIAL);
  const [email, setEmail] = useState(INITIAL);
  const [password, setPassword] = useState(INITIAL);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setIsError(false);
    if (
      [
        validate(
          email.text,
          { notEmpty: true, emailPattern: true, maxLength: 30 },
          {
            setErrorMessage: (message: string) =>
              setEmail((state) => ({ ...state, error: message })),
          },
        ),
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
      const result = await signUp({
        username: username.text,
        email: email.text,
        password: password.text,
      });
      setEmail(INITIAL);
      setPassword(INITIAL);
      setUsername(INITIAL);
      console.log(result);
    } catch (error) {
      setIsError(true);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={2}>
      <EmailField {...{ email, setEmail, loading }} />
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
          Зарегистрировать
        </Button>
      </FormControl>
    </Box>
  );
};
export default SignUp;
