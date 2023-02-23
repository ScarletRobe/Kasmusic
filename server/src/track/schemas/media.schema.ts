import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MediaDocument = Media & Document;

@Schema()
export class Media {
  @Prop()
  url: string;

  @Prop()
  name: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
