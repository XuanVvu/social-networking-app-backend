import { Entity, ManyToOne, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { User } from '@/modules/user/user.entity';
import { Post } from '@/modules/post/post.entity';

@Entity()
export class SavedPost extends BaseEntity {
  @ManyToOne(() => User, (user) => user.savedPosts)
  user: User;

  @ManyToOne(() => Post, (post) => post.savedBy, { onDelete: 'CASCADE' })
  post: Post;

  @CreateDateColumn()
  savedAt: Date;
}
