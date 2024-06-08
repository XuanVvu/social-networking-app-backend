import { BaseEntity } from '@/common/base.entity';
import { Entity, ManyToOne } from 'typeorm';
import { User } from '@/modules/user/user.entity';
import { Post } from '@/modules/post/post.entity';
@Entity()
export class PostLike extends BaseEntity {
  @ManyToOne(() => User, (user) => user.postLike)
  user: User;

  @ManyToOne(() => Post, (post) => post.postLike)
  post: Post;
}
