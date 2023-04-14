import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Document, Model } from 'mongoose';

import { User } from './schemas/user.schema';
import { Role } from './schemas/role.schema';
import { RoleDocument } from './schemas/role.schema';
import { UserDocument } from './schemas/user.schema';

import { CreateUserDto } from './dto/create-user.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async findByIdAndUpdate(id: string, dto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(id, dto, {
      returnDocument: 'after',
    });
  }

  async findOne(params: object) {
    return await this.userModel.findOne(params);
  }

  async addUploadedTrack(
    id: mongoose.Types.ObjectId,
    trackId: mongoose.Types.ObjectId,
  ) {
    const user = await this.userModel.findById(id);
    user.uploadedTracks.push(trackId);
    await user.save();
  }

  async removeUploadedTrack(
    id: mongoose.Types.ObjectId,
    trackId: mongoose.Types.ObjectId,
  ) {
    const user = await this.userModel.findById(id);
    user.uploadedTracks = user.uploadedTracks.filter(
      (trId) => trId.toString() !== trackId.toString(),
    );
    await user.save();
  }

  async addLikedTrack(
    id: mongoose.Types.ObjectId,
    trackId: mongoose.Types.ObjectId,
  ) {
    const user = await this.userModel.findById(id);
    if (user.likedTracks.includes(trackId)) {
      throw new BadRequestException('Already liked');
    }
    user.likedTracks.push(trackId);
    await user.save();
  }

  async removeLikedTrack(
    id: mongoose.Types.ObjectId,
    trackId: mongoose.Types.ObjectId,
  ) {
    const user = await this.userModel.findById(id);
    if (!user.likedTracks.includes(trackId)) {
      throw new BadRequestException('Not liked');
    }

    user.likedTracks = user.likedTracks.filter(
      (trId) => trId.toString() !== trackId.toString(),
    );
    await user.save();
  }
}
