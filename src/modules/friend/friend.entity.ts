import { BaseEntity } from '@/common/base.entity';
import { User } from '@/modules/user/user.entity';
import { Entity, ManyToOne, Column } from 'typeorm';

@Entity()
export class Friend extends BaseEntity {
  @ManyToOne(() => User, (user) => user.friendsRequested)
  requester: User;

  @ManyToOne(() => User, (user) => user.friendsReceived)
  recipient: User;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected';
}
