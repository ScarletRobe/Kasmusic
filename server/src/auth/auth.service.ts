import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';

import { MailService } from '../mail/mail.service';
import { UserService } from './../user/user.service';

import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private mailService: MailService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async register(dto: RegisterUserDto) {
    const isUserExists = Boolean(
      await this.userService.findOne({
        $or: [{ username: dto.username }, { email: dto.email }],
      }),
    );
    if (isUserExists) {
      throw new Error('User with this username or email already exists');
    }
    const hashedPassword = bcrypt.hashSync(dto.password, 3);
    const activationToken = uuid.v4();
    const activationLink = `${process.env.BASE_URL}/user/activate/${activationToken}`;

    const user = await this.userService.createUser({
      ...dto,
      activationLink,
      hashedPassword,
    });
    await this.mailService.sendActivationMail(dto.email, activationLink);

    return user;
  }

  async activate(activationLink) {
    const user = await this.userService.findOne({ activationLink });
    if (!user) {
      throw new Error('Некорректная ссылка для активации');
    }
    user.isActivated = true;
    user.activationLink = undefined;
    user.save();
  }
}
