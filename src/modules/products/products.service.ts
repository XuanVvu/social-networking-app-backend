import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '@/shared/helpers/checkPermission.helper';
import { User } from '@/modules/user/user.entity';
import { Repository } from 'typeorm';
import { ProductsDTO } from './dto/product.dto';
import { Product } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  async createProduct(requestBody: ProductsDTO, currentUser: User) {
    requestBody.createdAt = new Date();
    requestBody.updatedAt = new Date();
    const product = await this.productsRepository.create(requestBody);
    product.user = currentUser;
    return this.productsRepository.save(product);
  }

  async findAllProducts(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['user'] });
  }

  async findProductById(id: number): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async updateProduct(id: number, currentUser: User, productUpdate: Product) {
    productUpdate.updatedAt = new Date();
    if (productUpdate.user) {
      throw new BadRequestException('Cannot change user');
    }
    const product = await this.findProductById(id);
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    Permission.check(product.user.id, currentUser);
    return await this.productsRepository.update(id, productUpdate);
  }

  async deleteProduct(id: number, currentUser: User) {
    const deletedProduct = await this.findProductById(id);
    if (!deletedProduct) {
      throw new BadRequestException('Product not found');
    }

    Permission.check(deletedProduct.user.id, currentUser);

    await this.productsRepository.delete(id);
  }
}
