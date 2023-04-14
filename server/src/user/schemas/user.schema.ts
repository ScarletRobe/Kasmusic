import mongoose, { Date, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Track } from '../../track/schemas/track.schema';
import { Roles } from './../enums';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, required: true, maxlength: 30 })
  email: string;

  @Prop({ default: false })
  isActivated: boolean;

  @Prop()
  activationLink: string;

  @Prop({
    unique: true,
    required: true,
    maxlength: 30,
    minlength: 3,
  })
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
  roles: string[];

  @Prop({ default: null })
  refreshToken: string | null;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }],
    default: [],
  })
  uploadedTracks: mongoose.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }],
    default: [],
  })
  likedTracks: mongoose.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
