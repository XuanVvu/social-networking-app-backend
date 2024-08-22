import { CommentController } from '@/modules/comment/comment.controller';
import { Post } from '@/modules/post/post.entity';
import { Module } from '@nestjs/common';
import { Comment } from '@/modules/comment/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { UserService } from '@/modules/user/user.service';
import { User } from '@/modules/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Comment])],
  providers: [CommentService, UserService],
  controllers: [CommentController],
})
export class CommentModule {}
