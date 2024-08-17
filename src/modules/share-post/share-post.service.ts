import { Post } from '@/modules/post/post.entity';
import { SharedPost } from '@/modules/share-post/share-post.entity';
import { User } from '@/modules/user/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SharePostService {
  constructor(
    @InjectRepository(SharedPost)
    private sharedPostRepository: Repository<SharedPost>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async sharePost(
    postId: number,
    userId: number,
    caption?: string,
  ): Promise<SharedPost> {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const sharedPost = this.sharedPostRepository.create({
      sharedBy: user,
      originalPost: post,
      caption,
    });

    return this.sharedPostRepository.save(sharedPost);
  }

  async getSharedPosts(userId: number): Promise<SharedPost[]> {
    return this.sharedPostRepository.find({
      where: { sharedBy: { id: userId } },
      relations: ['originalPost', 'sharedBy'],
      order: { sharedAt: 'DESC' },
    });
  }

  async getPostShares(postId: number): Promise<SharedPost[]> {
    return this.sharedPostRepository.find({
      where: { originalPost: { id: postId } },
      relations: ['sharedBy'],
      order: { sharedAt: 'DESC' },
    });
  }

  async deleteSharedPost(sharedPostId: number, userId: number): Promise<void> {
    const sharedPost = await this.sharedPostRepository.findOne({
      where: { id: sharedPostId, sharedBy: { id: userId } },
    });

    if (!sharedPost) {
      throw new NotFoundException('Shared post not found');
    }

    await this.sharedPostRepository.remove(sharedPost);
  }
}
