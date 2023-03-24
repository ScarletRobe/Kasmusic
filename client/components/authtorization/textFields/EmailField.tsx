import * as React from 'react';

import {
  FormControl,
  TextField,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';

type EmailFieldProps = {
  email: { text: string; error: string };
  setEmail: (props: { text: string; error: string }) => void;
  loading: boolean;
};

const EmailField: React.FC<EmailFieldProps> = ({
  email,
  setEmail,
  loading,
}) => {
  return (
    <FormControl margin="none" fullWidth error={Boolean(email.error)}>
      <TextField
        placeholder="Почтовый адрес"
        error={Boolean(email.error)}
        variant="outlined"
        value={email.text}
        disabled={loading}
        onChange={(e) => {
          setEmail({ text: e.target.value, error: '' });
        }}
        type={'email'}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MailOutlineRoundedIcon
                color={email.error ? 'error' : 'action'}
              />
            </InputAdornment>
          ),
        }}
      />
      <FormHelperText>{email.error || ' '}</FormHelperText>
    </FormControl>
  );
};
export default React.memo(EmailField);
