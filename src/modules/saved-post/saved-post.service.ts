import { Post } from '@/modules/post/post.entity';
import { SavedPost } from '@/modules/saved-post/saved-post.entity';
import { User } from '@/modules/user/user.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SavedPostService {
  constructor(
    @InjectRepository(SavedPost)
    private savedPostRepository: Repository<SavedPost>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async savePost(user: User, postId: number): Promise<SavedPost> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('User or Post not found');
    }
    const existingSavedPost = await this.savedPostRepository.findOne({
      where: { user: { id: user.id }, post: { id: postId } },
    });

    if (existingSavedPost) {
      throw new ConflictException('This post is already saved by the user');
    }

    const savedPost = this.savedPostRepository.create({ user, post });
    return this.savedPostRepository.save(savedPost);
  }

  async removeSavedPost(userId: number, postId: number): Promise<void> {
    const savedPost = await this.savedPostRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (!savedPost) {
      throw new NotFoundException('Saved post not found');
    }

    await this.savedPostRepository.remove(savedPost);
  }

  async getSavedPosts(userId: number): Promise<SavedPost[]> {
    return this.savedPostRepository.find({
      where: { user: { id: userId } },
      relations: ['post', 'post.photos', 'post.comments', 'post.postLikes'],
      order: {
        savedAt: 'DESC',
      },
    });
  }
}
