import { PostLike } from '@/modules/post-like/post-like.entity';
import { Post } from '@/modules/post/post.entity';
import { User } from '@/modules/user/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class PostLikeService {
  constructor(
    @InjectRepository(PostLike)
    private likeRepository: Repository<PostLike>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async getLikeStatus(postId: number, user: User): Promise<boolean> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { post: { id: postId }, user: { id: user.id } },
    });

    return !!existingLike;
  }

  async getLikedPosts(user: User): Promise<Post[]> {
    const likes = await this.likeRepository.find({
      where: { user: { id: user.id } },
      relations: ['post'],
    });

    return likes.map((like) => like.post);
  }

  async updateLikeStatus(
    postId: number,
    user: User,
    liked: boolean,
  ): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (liked) {
      const existingLike = await this.likeRepository.findOne({
        where: { post: { id: postId }, user: { id: user?.id } },
      });

      if (existingLike) {
        throw new BadRequestException(' ');
      }

      const newLike = this.likeRepository.create({ post, user });
      await this.likeRepository.save(newLike);
    } else {
      const like = await this.likeRepository.findOne({
        where: { post: { id: postId }, user: { id: user?.id } },
      });

      if (!like) {
        throw new NotFoundException('Like not found');
      }

      await this.likeRepository.remove(like);
    }
  }

  async getLikesByPost(postId: number): Promise<User[]> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['postLikes', 'postLikes.user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post.postLikes.map((like) => like.user);
  }

  async getLikeCount(postId: number): Promise<number> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['postLikes'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post.postLikes.length;
  }
}
