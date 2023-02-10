import { ObjectId } from 'mongoose';

export class AddCommentDto {
  readonly username: string;
  readonly text: string;
  readonly trackId: ObjectId;
}
