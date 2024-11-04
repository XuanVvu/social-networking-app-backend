import { Exclude } from 'class-transformer';
import { BaseEntity } from '@/common/base.entity';
import { Product } from '@/modules/products/products.entity';
import { Comment } from '@/modules/comment/comment.entity';

import { Entity, Column, OneToMany } from 'typeorm';
import { Post } from '@/modules/post/post.entity';
import { PostLike } from '@/modules/post-like/post-like.entity';
import { Friend } from '@/modules/friend/friend.entity';
import { SharedPost } from '@/modules/share-post/share-post.entity';
import { SavedPost } from '@/modules/saved-post/saved-post.entity';
import { Chat } from '@/modules/chat/chat.entity';
import { Message } from '@/modules/message/message.entity';
import { Notification } from '@/modules/notification/notification.entity';

enum ROLES {
  ADMIN = 'ADMIN',
  MOD = 'MOD',
  USER = 'USER',
}

enum Gender {
  Male = 1,
  Female = 2,
}
@Entity()
export class User extends BaseEntity {
  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: '' })
  description: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.Male,
  })
  gender: Gender;

  @Column({ default: null })
  avatar: string;

  @Column({ default: ROLES.USER })
  @Exclude()
  role: ROLES;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpires: Date;

  @Column({ nullable: true })
  confirmationToken: string;

  @Column({ default: false })
  isConfirmed: boolean;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => PostLike, (postLike) => postLike.user)
  postLike: PostLike;

  @OneToMany(() => Friend, (friend) => friend.requester)
  friendsRequested: Friend[];

  @OneToMany(() => Friend, (friend) => friend.recipient)
  friendsReceived: Friend[];

  @OneToMany(() => SharedPost, (sharedPost) => sharedPost.sharedBy)
  sharedPosts: SharedPost[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => SavedPost, (savedPost) => savedPost.user)
  savedPosts: SavedPost[];

  @OneToMany(() => Chat, (chat) => chat.user1)
  chatsAsUser1: Chat[];

  @OneToMany(() => Chat, (chat) => chat.user2)
  chatsAsUser2: Chat[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];
}
