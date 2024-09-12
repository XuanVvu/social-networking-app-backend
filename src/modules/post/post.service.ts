import { CreatePostDto } from './dto/createPostDto';
import { User } from '@/modules/user/user.entity';
import { Post } from '@/modules/post/post.entity';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Photo } from '@/modules/photo/photo.entity';
import { TransactionService } from '@/shared/services/transaction.service';
import { Permission } from '@/shared/helpers/checkPermission.helper';
import { UpdatePostDto } from '@/modules/post/dto/updatePostDto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
    private transactionService: TransactionService,
  ) {}

  async createPost(createPost: CreatePostDto, currentUser: User) {
    return this.transactionService.executeInTransaction(
      async (entityManager) => {
        const post = this.postRepository.create({
          content: createPost.content,
          user: currentUser,
          createdAt: new Date(),
        });
        const savedPost = await entityManager.save(post);
        const savedPhotos = await Promise.all(
          createPost.photos.map(async (photo) => {
            const newPhoto = this.photoRepository.create({
              url: `/uploads/posts/${photo.filename}`,
              post: savedPost, // Use savedPost instead of post to ensure the post ID is available
            });
            return await entityManager.save(newPhoto);
          }),
        );

        savedPost.photos = savedPhotos;
        return await entityManager.save(savedPost);
      },
    );
  }

  async updatePost(id: number, posUpdate: UpdatePostDto, currentUser: User) {
    return this.transactionService.executeInTransaction(
      async (entityManager) => {
        const post = await this.findPostById(id);
        if (!post) {
          throw new HttpException('User does not exist', 404);
        }
        Permission.check(post.user.id, currentUser);

        if (posUpdate.content !== undefined) {
          post.content = posUpdate.content;
        }

        if (
          posUpdate.photoIdsToDelete &&
          posUpdate.photoIdsToDelete.length > 0
        ) {
          const photosToDelete = post.photos.filter((photo) =>
            posUpdate.photoIdsToDelete.includes(photo.id),
          );
          post.photos = post.photos.filter(
            (photo) => !posUpdate.photoIdsToDelete.includes(photo.id),
          );
          await entityManager.remove(photosToDelete);
        }

        if (posUpdate.photosToAdd && posUpdate.photosToAdd.length > 0) {
          const newPhotos = posUpdate.photosToAdd.map((photo) =>
            this.photoRepository.create({
              url: `/uploads/posts/${photo.filename}`,
              post: post,
            }),
          );
          const savedNewPhotos = await entityManager.save(Photo, newPhotos);
          post.photos = [...post.photos, ...savedNewPhotos];
        }

        // Save updated post
        const updatedPost = await entityManager.save(Post, post);

        return updatedPost;
      },
    );
  }

  async findPostById(id: number): Promise<Post> {
    return this.transactionService.executeInTransaction(
      async (entityManager) => {
        const post = await entityManager.findOne(Post, {
          where: { id: id },
          relations: ['user', 'comments', 'postLikes', 'photos'],
        });
        if (!post) {
          throw new NotFoundException(`Post with ID ${id} not found`);
        }

        return post;
      },
    );
  }

  async findPostByUserId(userId: number): Promise<Post[]> {
    return this.transactionService.executeInTransaction(
      async (entityManager) => {
        const post = await entityManager.find(Post, {
          where: { user: { id: userId } },
          relations: ['user', 'comments', 'postLikes', 'photos'],
          order: {
            createdAt: 'DESC',
          },
        });
        if (!post) {
          throw new NotFoundException(`Post with ID ${userId} not found`);
        }

        return post;
      },
    );
  }

  async getAllPosts(): Promise<Post[]> {
    return this.transactionService.executeInTransaction(
      async (entityManager) => {
        const allPosts = await entityManager.find(Post, {
          relations: ['user', 'comments', 'postLikes', 'photos'],
          order: {
            createdAt: 'DESC',
          },
        });

        return allPosts;
      },
    );
  }

  async deletePost(id: number, currentUser: User): Promise<void> {
    return this.transactionService.executeInTransaction(
      async (entityManager) => {
        try {
          const existPost = await entityManager.findOne(Post, {
            where: { id: id },
            relations: ['user', 'comments', 'postLikes', 'photos'],
          });
          if (!existPost) {
            throw new HttpException('User does not exist', 404);
          }
          await entityManager.remove(existPost);
        } catch (error) {
          console.log(error);
        }
      },
    );
  }

  async searchPosts(query: string) {
    return this.postRepository.find({
      where: { content: Like(`%${query}%`) },
      relations: ['user', 'comments', 'postLikes', 'photos'],
    });
  }
}
