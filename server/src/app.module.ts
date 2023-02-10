import { TrackModule } from './track/track.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TrackModule,
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@cluster0.jktggcn.mongodb.net/?retryWrites=true&w=majority',
    ),
  ],
})
export class AppModule {}
