import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const PORT = 3000;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT, () => {
    console.log(`App start with port ${PORT}`);
  });
}
bootstrap();
