import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserService } from '@/modules/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/user/user.entity';
import { Post } from '@/modules/post/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User])],
  providers: [PostService, UserService],
  controllers: [PostController],
})
export class PostModule {}
