import { CreateRoleDto } from './dto/create-role.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

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
}
