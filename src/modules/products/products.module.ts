import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/user/user.entity';
import { UserService } from '@/modules/user/user.service';
import { ProductsController } from './products.controller';
import { Product } from './products.entity';
import { ProductsService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, User])],
  providers: [ProductsService, UserService],
  controllers: [ProductsController],
  exports: [TypeOrmModule.forFeature([Product, User])],
})
export class ProductsModule {}
