import { Body, Controller, Post } from '@nestjs/common';
import { Get, Req } from '@nestjs/common/decorators';

import { Request } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() dto: RegisterUserDto) {
    try {
      return await this.authService.register(dto);
    } catch (error) {
      return error.message;
    }
  }

  @Post('/login')
  async login(@Body() dto: LoginDto) {
    try {
      return await this.authService.login(dto);
    } catch (error) {
      return error.message;
    }
  }

  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
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
