import { Post } from '@/modules/post/post.entity';
import { Comment } from '@/modules/comment/comment.entity';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/modules/user/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async createComment(
    content: string,
    postId: number,
    user: User,
  ): Promise<Comment> {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = this.commentRepository.create({
      content,
      author: user,
      post,
      createdAt: new Date(),
    });

    return this.commentRepository.save(comment);
  }

  async updateComment(
    id: number,
    content: string,
    userId: number,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.id !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    comment.content = content;
    comment.updatedAt = new Date();
    return this.commentRepository.save(comment);
  }

  async deleteComment(id: number, user: User): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'post', 'post.user'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.id !== user.id && comment.post.user.id !== user.id) {
      throw new ForbiddenException(
        'You can only delete your own comments or comments on your posts',
      );
    }

    await this.commentRepository.remove(comment);
  }

  async getCommentsByPost(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }
}
