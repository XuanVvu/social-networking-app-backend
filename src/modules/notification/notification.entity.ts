import { BaseEntity } from '@/common/base.entity';
import { User } from '@/modules/user/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class Notification extends BaseEntity {
  @ManyToOne(() => User, (user) => user.notifications)
  recipient: User;

  @Column()
  type: string; // 'like', 'comment', 'friend_request'

  @Column()
  content: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  relatedItemId: number; // ID của bài viết hoặc bình luận liên quan
}
