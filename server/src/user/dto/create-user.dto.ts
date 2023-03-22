export class CreateUserDto {
  readonly email: string;
  readonly username: string;
  readonly hashedPassword: string;
  readonly activationLink: string;
}
