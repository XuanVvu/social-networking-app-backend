import { PostLike } from '@/modules/post-like/post-like.entity';
import { Post } from '@/modules/post/post.entity';
import { User } from '@/modules/user/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostLikeService {
  constructor(
    @InjectRepository(PostLike)
    private likeRepository: Repository<PostLike>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async likePost(postId: number, userId: number): Promise<PostLike> {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });

    if (existingLike) {
      throw new BadRequestException('You have already liked this post');
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    const newLike = this.likeRepository.create({ post, user });
    return this.likeRepository.save(newLike);
  }

  async unlikePost(postId: number, userId: number): Promise<void> {
    const like = await this.likeRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    await this.likeRepository.remove(like);
  }

  async getLikesByPost(postId: number): Promise<User[]> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['likes', 'likes.user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post.postLikes.map((like) => like.user);
  }

  async getLikeCount(postId: number): Promise<number> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['likes'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post.postLikes.length;
  }
}
