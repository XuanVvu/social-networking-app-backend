import { BaseEntity } from '@/common/base.entity';
import { Message } from '@/modules/message/message.entity';
import { User } from '@/modules/user/user.entity';
import { Entity, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Chat extends BaseEntity {
  @ManyToOne(() => User, (user) => user.chatsAsUser1)
  user1: User;

  @ManyToOne(() => User, (user) => user.chatsAsUser2)
  user2: User;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
