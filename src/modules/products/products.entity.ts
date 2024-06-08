import { BaseEntity } from '@/common/base.entity';
import { User } from '@/modules/user/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @Column({ length: 500 })
  productName: string;

  @Column('text')
  description: string;

  @Column({ default: null })
  productImage: string;

  @Column()
  quality: string;

  @Column('int')
  purchasePrice: number;

  @Column('int')
  sellingPrice: number;

  @Column('int')
  estimateSellingPrice: number;

  @Column({ default: false })
  isSold: boolean;

  @ManyToOne(() => User, (user) => user.products)
  user: User;
}
