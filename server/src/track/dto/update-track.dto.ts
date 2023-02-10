import { Optional } from '@nestjs/common';
import { Comment } from '../schemas/comment.schema';

export class UpdateTrackDto {
  @Optional()
  readonly name?: string;
  @Optional()
  readonly artist?: string;
  @Optional()
  readonly text?: string;
  @Optional()
  readonly listens?: number;
  @Optional()
  readonly comments?: Comment[];
}
