import { Module } from '@nestjs/common';
import { PostLikeService } from './post-like.service';
import { PostLikeController } from './post-like.controller';

@Module({
  providers: [PostLikeService],
  controllers: [PostLikeController]
})
export class PostLikeModule {}
