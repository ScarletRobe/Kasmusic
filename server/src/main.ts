import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

const start = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser.call(this));
    app.enableCors({
      origin: true,
    });
    await app.listen(PORT, () =>
      console.log(`server started on port: ${PORT}`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
