import * as React from 'react';

import PasswordField from './textFields/PasswordField';
import UsernameField from './textFields/UsernameField';

import { Box, FormControl, Button } from '@mui/material';
// import checkValid from '../../util/checkvalid';

const INITIAL = { text: '', error: '' };

const SignIn = () => {
  const [username, setUsername] = React.useState(INITIAL);
  const [password, setPassword] = React.useState(INITIAL);
  const [loading, setLoading] = React.useState(false);

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
          // onClick={handleSubmit}
        >
          Войти
        </Button>
      </FormControl>
    </Box>
  );
};
export default SignIn;
