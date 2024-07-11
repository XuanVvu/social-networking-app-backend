import { Exclude } from 'class-transformer';
import { BaseEntity } from '@/common/base.entity';
import { Entity, Column, ManyToMany, ManyToOne } from 'typeorm';
import { Post } from '@/modules/post/post.entity';

@Entity()
export class Photo extends BaseEntity {
  @Column()
  url: string;
  @ManyToOne(() => Post, (post) => post.photos, { onDelete: 'CASCADE' })
  post: Post;
}
