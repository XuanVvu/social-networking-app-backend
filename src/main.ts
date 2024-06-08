import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const PORT = 3000;
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '../uploads'));
  await app.listen(PORT, () => {
    console.log(`App start with port ${PORT}`);
  });
}
bootstrap();
