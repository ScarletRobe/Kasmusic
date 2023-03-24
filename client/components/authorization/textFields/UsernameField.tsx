import * as React from 'react';

import {
  FormControl,
  TextField,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';

type NameFieldProps = {
  username: { text: string; error: string };
  setUsername: (props: { text: string; error: string }) => void;
  loading: boolean;
};

const UsernameField: React.FC<NameFieldProps> = ({
  username,
  setUsername,
  loading,
}) => {
  return (
    <FormControl margin="none" fullWidth error={Boolean(username?.error)}>
      <TextField
        placeholder="Имя пользователя"
        error={Boolean(username?.error)}
        variant="outlined"
        value={username?.text}
        disabled={loading}
        onChange={(e) => {
          setUsername({ text: e.target.value, error: '' });
        }}
        type={'name'}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonOutlineRoundedIcon
                color={username?.error ? 'error' : 'action'}
              />
            </InputAdornment>
          ),
        }}
      />
      <FormHelperText>{username?.error || ' '}</FormHelperText>
    </FormControl>
  );
};
export default React.memo(UsernameField);
