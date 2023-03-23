import { RolesGuard } from './../common/guards/roles.guard';
import { Body, Controller, Post } from '@nestjs/common';
import { Get, Param, UseGuards } from '@nestjs/common/decorators';
import { RequiredRoles } from '../common/decorators/requiredRoles.decorator';

import { UserService } from './user.service';

import { CreateRoleDto } from './dto/create-role.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';

import { Roles } from './enums';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/update/:id')
  @RequiredRoles(Roles.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  async update(@Body() params, @Param() { id }) {
    return await this.userService.findByIdAndUpdate(id, params);
  }

  @Post('/role')
  @RequiredRoles(Roles.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
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
  @RequiredRoles(Roles.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    try {
      return this.userService.findOne({ _id: id });
    } catch (error) {
      return error.message;
    }
  }
}
