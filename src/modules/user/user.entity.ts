import { Exclude } from 'class-transformer';
import { BaseEntity } from '@/common/base.entity';
import { Product } from '@/modules/products/products.entity';
import { Comment } from '@/modules/comment/comment.entity';

import { Entity, Column, OneToMany } from 'typeorm';
import { Post } from '@/modules/post/post.entity';
import { PostLike } from '@/modules/post-like/post-like.entity';
import { Friend } from '@/modules/friend/friend.entity';
import { SharedPost } from '@/modules/share-post/share-post.entity';

enum ROLES {
  ADMIN = 'ADMIN',
  MOD = 'MOD',
  USER = 'USER',
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

  @Column({ default: null })
  avatar: string;

  @Column({ default: ROLES.USER })
  @Exclude()
  role: ROLES;

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
}
