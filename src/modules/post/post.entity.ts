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
@Entity()
export class Post extends BaseEntity {
  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
