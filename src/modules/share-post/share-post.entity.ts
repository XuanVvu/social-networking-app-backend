import { BaseEntity } from '@/common/base.entity';
import { Post } from '@/modules/post/post.entity';
import { User } from '@/modules/user/user.entity';
import { Entity, ManyToOne, CreateDateColumn, Column } from 'typeorm';

@Entity()
export class SharedPost extends BaseEntity {
  @ManyToOne(() => User, (user) => user.sharedPosts)
  sharedBy: User;

  @ManyToOne(() => Post, (post) => post.shares)
  originalPost: Post;

  @Column({ nullable: true })
  caption: string;

  @CreateDateColumn()
  sharedAt: Date;
}
