import { Body, Controller, Post } from '@nestjs/common';
import { Get, Req } from '@nestjs/common/decorators';

import { UserService } from './user.service';

import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async register(@Body() dto: CreateUserDto) {
    try {
      return await this.userService.register(dto);
    } catch (error) {
      return error.message;
    }
  }

  @Post('/role')
  async createRole(@Body() dto: CreateRoleDto) {
    try {
      await this.userService.createRole(dto);
      return 'Created';
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
    }
  }

  @Get('/activate/:token')
  async activate(@Req() req: Request) {
    try {
      return await this.userService.activate(
        process.env.BASE_URL + req.originalUrl,
      );
    } catch (error) {
      return error.message;
    }
  }
}
