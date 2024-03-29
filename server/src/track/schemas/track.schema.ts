import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Comment } from './comment.schema';
import { Media } from './media.schema';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop()
  name: string;

  @Prop()
  artist: string;

  @Prop()
  text: string;

  @Prop()
  listens: number;

  @Prop()
  picture: Media;

  @Prop()
  audio: Media;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: mongoose.Types.ObjectId;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Number, default: 0 })
  likes: number;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
