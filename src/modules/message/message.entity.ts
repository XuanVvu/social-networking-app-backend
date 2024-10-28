import { BaseEntity } from '@/common/base.entity';
import { Chat } from '@/modules/chat/chat.entity';
import { User } from '@/modules/user/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class Message extends BaseEntity {
  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;

  @Column({ type: 'varchar', charset: 'utf8mb4' })
  content: string;
}
