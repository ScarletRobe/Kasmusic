import { Roles } from '@/consts';

export type User = {
  id: string;
  username: string;
  avatarLink: string;
  isActivated: boolean;
  roles: (keyof typeof Roles)[];
};

export type SignInParams = Omit<SignUpParams, 'email'>;

export type SignResponse = {
  accessToken: string;
  user: User;
};

export type SignUpParams = {
  email: string;
  username: string;
  password: string;
};
