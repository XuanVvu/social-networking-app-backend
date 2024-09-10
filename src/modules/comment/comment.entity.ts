import { BaseEntity } from '@/common/base.entity';
import { Post } from '@/modules/post/post.entity';
import { User } from '@/modules/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Comment extends BaseEntity {
  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  author: User;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  post: Post;
}
