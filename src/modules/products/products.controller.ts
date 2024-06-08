import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '@/shared/decorator/currentUser.decorator';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { User } from '@/modules/user/user.entity';
import { ProductsDTO } from './dto/product.dto';
import { Product } from './products.entity';
import { ProductsService } from './products.service';

@Controller('api/v1/products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  @Get()
  getAllProducts() {
    return this.productsService.findAllProducts();
  }

  @Post()
  @UseGuards(AuthGuard)
  createProduct(
    @Body() product: ProductsDTO,
    @CurrentUser() currentUser: User,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.createProduct(product, currentUser);
  }

  @Get('/:id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findProductById(id);
  }

  @Put('/update/:id')
  @UseGuards(AuthGuard)
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
    @Body() productUpdate: Product,
  ) {
    return this.productsService.updateProduct(id, currentUser, productUpdate);
  }

  @Delete('deleted/:id')
  @UseGuards(AuthGuard)
  deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.productsService.deleteProduct(id, currentUser);
  }
}
