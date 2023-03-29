import React from 'react';
import { useRouter } from 'next/router';

import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useLogoutMutation } from '@/services/authService';

import Loader from './Loaders/Loader';

import { AuthorizationStatus, Roles } from '@/consts';

import {
  Avatar,
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const UserMiniProfile = () => {
  const router = useRouter();
  const [logout] = useLogoutMutation();

  const user = useTypedSelector((state) => state.auth.user);
  const authorizationStatus = useTypedSelector(
    (state) => state.auth.authorizationStatus,
  );

  switch (authorizationStatus) {
    case AuthorizationStatus.Unknown:
      return (
        <Card
          sx={{ boxShadow: 'none', backgroundColor: '#673ab7', my: 'auto' }}
        >
          <Box py={1} px={2}>
            <Loader color="white" size="Small" />
          </Box>
        </Card>
      );
    case AuthorizationStatus.NoAuth:
      return (
        <Card
          sx={{ boxShadow: 'none', backgroundColor: '#673ab7', my: 'auto' }}
        >
          <Box py={1} px={2}>
            <Stack>
              <Button
                sx={{ color: 'white' }}
                variant="outlined"
                endIcon={<LoginRoundedIcon />}
                onClick={() => router.push('/authorization')}
              >
                Войти
              </Button>
            </Stack>
          </Box>
        </Card>
      );
    case AuthorizationStatus.Auth:
      if (!user) return;
      return (
        <Card
          sx={{ boxShadow: 'none', backgroundColor: '#673ab7', my: 'auto' }}
        >
          <Box py={1} px={2}>
            <Stack direction="row" alignItems="center" gap={1}>
              <Avatar alt={user.username} src={user.avatarLink} />
              <Stack>
                <Typography variant="body1" color="secondary">
                  {user.username}
                </Typography>
                <Typography variant="body1" color="secondary">
                  {Roles[user.roles[user.roles.length - 1]]}
                </Typography>
              </Stack>
              <IconButton onClick={() => logout()}>
                <LogoutRoundedIcon htmlColor="white" />
              </IconButton>
            </Stack>
          </Box>
        </Card>
      );
  }
};

export default UserMiniProfile;
