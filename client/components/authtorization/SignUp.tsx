import * as React from 'react';

import EmailField from './textFields/EmailField';
import PasswordField from './textFields/PasswordField';
import UsernameField from './textFields/UsernameField';

import { Box, FormControl, Button } from '@mui/material';

const INITIAL = { text: '', error: '' };

const SignUp: React.FC = () => {
  const [username, setUsername] = React.useState(INITIAL);
  const [email, setEmail] = React.useState(INITIAL);
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState(INITIAL);


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
          // onClick={handleSubmit}
        >
          Зарегистрировать
        </Button>
      </FormControl>
    </Box>
  );
};
export default SignUp;
