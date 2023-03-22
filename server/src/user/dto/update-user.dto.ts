export class UpdateUserDto {
  email?: string;
  username?: string;
  password?: string;
  avatarLink?: string;
  refreshToken?: string;
  roles?: string;
  lastSeen?: Date;
}
