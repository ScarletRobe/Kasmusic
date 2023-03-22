import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './schemas/user.schema';
import { Role } from './schemas/role.schema';
import { RoleDocument } from './schemas/role.schema';
import { UserDocument } from './schemas/user.schema';

import { CreateUserDto } from './dto/create-user.dto';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createUser(dto: CreateUserDto) {
    return await this.userModel.create({
      email: dto.email,
      username: dto.username,
      password: dto.hashedPassword,
      avatarLink: `https://api.multiavatar.com/${dto.username}.png?apikey=KUh2nrICkSFs5O`,
      activationLink: dto.activationLink,
    });
  }

  async createRole(dto: CreateRoleDto) {
    if (!dto.rolename) {
      throw new Error('Incorrect DTO');
    }
    if (await this.roleModel.findOne({ rolename: dto.rolename })) {
      throw new Error('Already exists');
    }
    await this.roleModel.create({ rolename: dto.rolename });
  }

  async updateUser(user: User & Document, dto: UpdateUserDto) {
    return await user.updateOne(dto, {
      returnDocument: 'after',
    });
  }
  async findOne(params: object) {
    const user = await this.userModel.findOne(params);
    return user;
  }
}
