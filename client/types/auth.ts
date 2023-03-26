export type User = {
  id: string;
  username: string;
  avatarLink: string;
  isActivated: boolean;
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
