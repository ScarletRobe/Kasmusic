import { Date, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Roles } from './../enums';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ default: false })
  isActivated: boolean;

  @Prop()
  activationLink: string;

  @Prop({ unique: true, required: true, maxlength: 30 })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatarLink: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  lastSeen: Date;

  @Prop({ type: [{ type: String, ref: 'Role' }], default: [Roles.USER] })
  roles;
}

export const UserSchema = SchemaFactory.createForClass(User);
