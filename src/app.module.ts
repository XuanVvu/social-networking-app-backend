import { FriendModule } from './modules/friend/friend.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PhotoModule } from './modules/photo/photo.module';
import { ProductsModule } from './modules/products/products.module';
import { UserModule } from './modules/user/user.module';
import { PostModule } from '@/modules/post/post.module';
import { PostLikeModule } from '@/modules/post-like/post-like.module';
import { SharePostModule } from '@/modules/share-post/share-post.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        // host: process.env.DATABASE_HOST,
        // port: parseInt(process.env.DATABASE_PORT, 10),
        // username: process.env.DATABASE_USER,
        // password: process.env.DATABASE_PASSWORD,
        // database: process.env.DATABASE_NAME,
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
    PostModule,
    PostLikeModule,
    FriendModule,
    SharePostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
