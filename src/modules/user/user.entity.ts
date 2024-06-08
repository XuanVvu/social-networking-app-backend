import { Exclude } from 'class-transformer';
import { BaseEntity } from '@/common/base.entity';
import { Product } from '@/modules/products/products.entity';
import { Comment } from '@/modules/comment/comment.entity';

import { Entity, Column, OneToMany } from 'typeorm';
import { Post } from '@/modules/post/post.entity';
import { PostLike } from '@/modules/post-like/post-like.entity';

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

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => PostLike, (postLike) => postLike.user)
  postLike: PostLike;
}
