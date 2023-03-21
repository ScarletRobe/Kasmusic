import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './../mail/mail.service';
import { UserService } from './user.service';

import { User } from './schemas/user.schema';
import { Role } from './schemas/role.schema';
import { RoleSchema } from './schemas/role.schema';
import { UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, MailService, JwtService],
})
export class UserModule {}
