import { ObjectId } from 'mongoose';

export class AddCommentDto {
  readonly user: ObjectId;
  readonly text: string;
  readonly trackId: ObjectId;
}
