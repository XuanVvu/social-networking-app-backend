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
import { SharedPost } from '@/modules/share-post/share-post.entity';
@Entity()
export class Post extends BaseEntity {
  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];

  @OneToMany(() => PostLike, (postLike) => postLike.post, { cascade: true })
  postLikes: PostLike[];

  @OneToMany(() => Photo, (photo) => photo.post, { cascade: true })
  photos: Photo[];

  @OneToMany(() => SharedPost, (sharedPost) => sharedPost.originalPost)
  shares: SharedPost[];
}
