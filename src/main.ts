import { CustomValidationPipe } from '@/shared/helpers/customValidationPipe';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as serveStatic from 'serve-static';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const PORT = 3000;
  app.use('/uploads', serveStatic(join(__dirname, '..', 'uploads')));
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalPipes(new CustomValidationPipe());
  app.enableCors({
    origin: 'http://localhost:5173', // Port frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Nếu bạn cần gửi cookie hoặc thông tin xác thực khác
  });

  app.useStaticAssets(join(__dirname, '../uploads'));
  await app.listen(PORT, () => {
    console.log(`App start with port ${PORT}`);
  });
}
bootstrap();
