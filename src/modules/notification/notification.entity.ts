import { BaseEntity } from '@/common/base.entity';
import { User } from '@/modules/user/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class Notification extends BaseEntity {
  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  message: string;

  @Column({ default: false })
  isRead: boolean;
}
