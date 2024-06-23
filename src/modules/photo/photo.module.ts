import { Post } from '@/modules/post/post.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoController } from './photo.controller';
import { Photo } from './photo.entity';
import { PhotoService } from './photo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Photo, Post])],
  providers: [PhotoService],
  controllers: [PhotoController],
  exports: [TypeOrmModule.forFeature([Photo, Post])],
})
export class PhotoModule {}
