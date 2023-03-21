import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';

import { User } from './schemas/user.schema';
import { Role } from './schemas/role.schema';
import { RoleDocument } from './schemas/role.schema';
import { UserDocument } from './schemas/user.schema';

import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createRole(dto: CreateRoleDto) {
    if (!dto.rolename) {
      throw new Error('Incorrect DTO');
    }
    if (await this.roleModel.findOne({ rolename: dto.rolename })) {
      throw new Error('Already exists');
    }
    await this.roleModel.create({ rolename: dto.rolename });
  }
}
