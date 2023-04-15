import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';
import * as uuid from 'uuid';

import { MailService } from '../mail/mail.service';
import { UserService } from './../user/user.service';

import { User } from '../user/schemas/user.schema';

import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  private saltRounds = 3;
  constructor(
    private mailService: MailService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async register(dto: RegisterUserDto) {
    const isUserExists = Boolean(
      await this.userService.findOne({
        $or: [
          { username: new RegExp('^' + dto.username + '$', 'i') },
          { email: dto.email.toLowerCase() },
        ],
      }),
    );
    if (isUserExists) {
      throw new BadRequestException(
        'User with this username or email already exists',
      );
    }

    const hashedPassword = bcrypt.hashSync(dto.password, this.saltRounds);
    const activationToken = uuid.v4();
    const activationLink = `${process.env.BASE_URL}/auth/activate/${activationToken}`;
    const user = await this.userService.createUser({
      ...dto,
      activationLink,
      hashedPassword,
    });

    const tokens = await this.getTokens({
      sub: user._id,
      username: user.username,
      roles: user.roles,
    });
    await this.updateRefreshToken({ user, token: tokens.refreshToken });

    await this.mailService.sendActivationMail(dto.email, activationLink);

    return {
      tokens,
      user: {
        avatarLink: user.avatarLink,
        id: user._id,
        username: user.username,
        isActivated: user.isActivated,
        roles: user.roles,
      },
    };
  }

  async login({ username, password }: LoginDto) {
    const user = await this.userService.findOne({ username });
    if (!user) {
      throw new BadRequestException('User with this name does not exist');
    }
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      throw new BadRequestException('Incorrect password');
    }

    const tokens = await this.getTokens({
      sub: user._id,
      username: user.username,
      roles: user.roles,
    });
    await this.updateRefreshToken({
      userId: user._id,
      token: tokens.refreshToken,
    });
    this.userService.updateUser(user, { lastSeen: new Date() });
    if (!user.isActivated) {
      await this.mailService.sendActivationMail(
        user.email,
        user.activationLink,
      );
    }

    return {
      tokens,
      user: {
        avatarLink: user.avatarLink,
        id: user._id,
        username: user.username,
        isActivated: user.isActivated,
        roles: user.roles,
        likedTracks: user.likedTracks,
      },
    };
  }

  async logout(userId: string) {
    return await this.userService.findByIdAndUpdate(userId, {
      refreshToken: null,
    });
  }

  async activate(activationLink) {
    const user = await this.userService.findOne({ activationLink });
    if (!user) {
      throw new BadRequestException('Некорректная ссылка для активации');
    }
    user.isActivated = true;
    user.activationLink = undefined;
    user.save();
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findOne({ _id: userId });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = bcrypt.compareSync(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    this.userService.updateUser(user, { lastSeen: new Date() });

    const tokens = await this.getTokens({
      sub: user.id,
      username: user.username,
      roles: user.roles,
    });
    await this.updateRefreshToken({ user, token: tokens.refreshToken });
    return {
      tokens,
      user: {
        avatarLink: user.avatarLink,
        id: user._id,
        username: user.username,
        isActivated: user.isActivated,
        roles: user.roles,
        likedTracks: user.likedTracks,
      },
    };
  }

  async updateRefreshToken({
    userId,
    user,
    token,
  }: {
    userId?: string;
    user?: User & Document;
    token: string;
  }) {
    const hashedRefreshToken = bcrypt.hashSync(token, this.saltRounds);
    if (userId) {
      await this.userService.findByIdAndUpdate(userId, {
        refreshToken: hashedRefreshToken,
      });
    }
    if (user) {
      await this.userService.updateUser(user, {
        refreshToken: hashedRefreshToken,
      });
    }
  }

  async getTokens(payload: { sub: string; username: string; roles: string[] }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '12h',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
