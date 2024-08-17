import { Post } from '@/modules/post/post.entity';
import { SharedPost } from '@/modules/share-post/share-post.entity';
import { User } from '@/modules/user/user.entity';
import { UserService } from '@/modules/user/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharePostController } from './share-post.controller';
import { SharePostService } from './share-post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, SharedPost])],
  controllers: [SharePostController],
  providers: [SharePostService, UserService],
})
export class SharePostModule {}
