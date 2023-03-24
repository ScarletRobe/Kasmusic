import * as React from 'react';

import {
  FormControl,
  TextField,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

type PasswordFieldProps = {
  password: { text: string; error: string };
  setPassword: (props: { text: string; error: string }) => void;
  loading: boolean;
};

const PasswordField: React.FC<PasswordFieldProps> = ({
  password,
  setPassword,
  loading,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const tooglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <FormControl margin="none" fullWidth error={Boolean(password.error)}>
      <TextField
        placeholder="Пароль"
        error={Boolean(password.error)}
        variant="outlined"
        value={password.text}
        disabled={loading}
        onChange={(e) => {
          setPassword({ text: e.target.value, error: '' });
        }}
        type={!showPassword ? 'password' : 'text'}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlinedIcon color={password.error ? 'error' : 'action'} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="toggle password" onClick={tooglePassword}>
                {!showPassword ? (
                  <VisibilityOutlinedIcon />
                ) : (
                  <VisibilityOffOutlinedIcon />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <FormHelperText>{password.error || ' '}</FormHelperText>
    </FormControl>
  );
};
export default React.memo(PasswordField);
