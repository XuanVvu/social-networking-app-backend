import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseEntity } from './common/base.entity';
import { Photo } from './modules/photo/photo.entity';
import { PhotoModule } from './modules/photo/photo.module';
import { Product } from './modules/products/products.entity';
import { ProductsModule } from './modules/products/products.module';
import { User } from './modules/user/user.entity';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { QuestionController } from './modules/question/question.controller';
import { QuestionModule } from './modules/question/question.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'Xuanvu0307@',
        database: 'posts',
        entities: ['dist/**/**/*.entity{.js, .ts}'],
        migrations: ['dist/database/migrations/*{.js, .ts}'],
      }),
    }),
    UserModule,
    PhotoModule,
    ProductsModule,
    CategoryModule,
    QuestionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
