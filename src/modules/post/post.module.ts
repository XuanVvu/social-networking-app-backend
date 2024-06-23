import { TransactionService } from '@/shared/services/transaction.service';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserService } from '@/modules/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/user/user.entity';
import { Post } from '@/modules/post/post.entity';
import { Comment } from '@/modules/comment/comment.entity';
import { PostLike } from '@/modules/post-like/post-like.entity';
import { PhotoService } from '@/modules/photo/photo.service';
import { Photo } from '@/modules/photo/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Comment, PostLike, Photo])],
  providers: [PostService, UserService, PhotoService, TransactionService],
  controllers: [PostController],
})
export class PostModule {}
