import { Exclude } from 'class-transformer';
import { BaseEntity } from '@/common/base.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class Photo extends BaseEntity {
  @Column({ length: 500 })
  name: string;

  @Column('text')
  description: string;

  @Exclude()
  @Column()
  filename: string;

  @Column('int')
  views: number;

  @Column()
  isPublished: boolean;
}
