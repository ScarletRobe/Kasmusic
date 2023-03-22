import { Body, Controller, Post } from '@nestjs/common';
import { Get, Param } from '@nestjs/common/decorators';

import { UserService } from './user.service';

import { CreateRoleDto } from './dto/create-role.dto';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.userService.findOne({ id });
    } catch (error) {
      return error.message;
    }
  }
}
