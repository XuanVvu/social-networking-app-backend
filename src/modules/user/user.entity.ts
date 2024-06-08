import { Exclude } from 'class-transformer';
import { BaseEntity } from '@/common/base.entity';
import { Product } from '@/modules/products/products.entity';

import { Entity, Column, OneToMany } from 'typeorm';

enum ROLES {
  ADMIN = 'ADMIN',
  MOD = 'MOD',
  USER = 'USER',
}
@Entity()
export class User extends BaseEntity {
  save() {
    throw new Error('Method not implemented.');
  }
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
}
