import { Photo } from '@/modules/photo/photo.entity';
import { BaseEntity } from '@/common/base.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '@/modules/user/user.entity';
import { Comment } from '@/modules/comment/comment.entity';
import { PostLike } from '@/modules/post-like/post-like.entity';
@Entity()
export class Post extends BaseEntity {
  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => PostLike, (postLike) => postLike.post)
  postLikes: PostLike[];

  @OneToMany(() => Photo, (photo) => photo.post)
  photos: Photo[];
}
