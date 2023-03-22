import { Body, Controller, Post } from '@nestjs/common';
import { Get, Req, Res, UseGuards } from '@nestjs/common/decorators';

import { Request, Response } from 'express';

import { AuthService } from './auth.service';

import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';

import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Res() res: Response, @Body() dto: RegisterUserDto) {
    try {
      const tokens = await this.authService.register(dto);
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
      });
      return res.json({ accessToken: tokens.accessToken });
    } catch (error) {
      return res.json({ message: error.message });
    }
  }

  @Post('/login')
  async login(@Res() res: Response, @Body() dto: LoginDto) {
    try {
      const tokens = await this.authService.login(dto);
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
      });
      return res.json({ accessToken: tokens.accessToken });
    } catch (error) {
      return res.json({ message: error.message });
    }
  }

  @UseGuards(AccessTokenGuard)
  @Get('/logout')
  logout(@Res() res: Response, @Req() req: Request) {
    try {
      this.authService.logout(req.user['sub']);
      res.clearCookie('refreshToken');
      return res.json('Logged out');
    } catch (error) {
      return res.json({ message: error.message });
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  async refreshTokens(@Res() res: Response, @Req() req: Request) {
    try {
      const userId = req.user['sub'];
      const { refreshToken } = req.cookies;
      const tokens = await this.authService.refreshTokens(userId, refreshToken);
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
      });
      return res.json({ accessToken: tokens.accessToken });
    } catch (error) {
      return res.json({ message: error.message });
    }
  }

  @Get('/activate/:token')
  async activate(@Req() req: Request) {
    try {
      return await this.authService.activate(
        process.env.BASE_URL + req.originalUrl,
      );
    } catch (error) {
      return error.message;
    }
  }
}
