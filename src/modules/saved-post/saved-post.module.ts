import { Post } from '@/modules/post/post.entity';
import { SavedPost } from '@/modules/saved-post/saved-post.entity';
import { User } from '@/modules/user/user.entity';
import { UserService } from '@/modules/user/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedPostController } from './saved-post.controller';
import { SavedPostService } from './saved-post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, SavedPost])],
  providers: [SavedPostService, UserService],
  controllers: [SavedPostController],
})
export class SavedPostModule {}
