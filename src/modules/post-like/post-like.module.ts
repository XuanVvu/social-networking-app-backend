import { Module } from '@nestjs/common';
import { PostLikeService } from './post-like.service';
import { PostLikeController } from './post-like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@/modules/post/post.entity';
import { User } from '@/modules/user/user.entity';
import { PostLike } from '@/modules/post-like/post-like.entity';
import { UserService } from '@/modules/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, PostLike])],
  providers: [PostLikeService, UserService],
  controllers: [PostLikeController],
})
export class PostLikeModule {}
