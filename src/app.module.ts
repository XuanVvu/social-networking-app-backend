import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PhotoModule } from './modules/photo/photo.module';
import { ProductsModule } from './modules/products/products.module';
import { UserModule } from './modules/user/user.module';
import { PostModule } from '@/modules/post/post.module';
import { PostLikeModule } from '@/modules/post-like/post-like.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: ['dist/**/**/*.entity{.js, .ts}'],
        migrations: ['dist/database/migrations/*{.js, .ts}'],
      }),
    }),
    UserModule,
    PhotoModule,
    ProductsModule,
    PostModule,
    PostLikeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
