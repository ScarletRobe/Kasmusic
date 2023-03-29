import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './../user/user.module';
import { FileService } from './../file/file.service';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';

import { Comment, CommentSchema } from './schemas/comment.schema';
import { Track, TrackSchema } from './schemas/track.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    UserModule,
  ],
  controllers: [TrackController],
  providers: [TrackService, FileService],
})
export class TrackModule {}
