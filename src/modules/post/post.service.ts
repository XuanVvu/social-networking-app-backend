import { CreatePostDto } from './dto/createPostDto';
import { User } from '@/modules/user/user.entity';
import { Post } from '@/modules/post/post.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async createPost(createPost: CreatePostDto, currenUser: User) {
    const newPost = await this.postRepository.create(createPost);
    newPost.user = currenUser;
    return this.postRepository.save(newPost);
  }
}
