import { TrackModule } from './track/track.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    TrackModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'static'),
    }),
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@cluster0.jktggcn.mongodb.net/?retryWrites=true&w=majority',
    ),
  ],
})
export class AppModule {}
