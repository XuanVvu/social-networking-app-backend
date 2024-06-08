import { IsNotEmpty } from 'class-validator';
import { BaseDto } from '@/common/base.dto';

export class ProductsDTO extends BaseDto {
  @IsNotEmpty()
  productName: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  productImage: string;

  @IsNotEmpty()
  quality: string;

  @IsNotEmpty()
  purchasePrice: number;

  @IsNotEmpty()
  sellingPrice: number;

  @IsNotEmpty()
  estimateSellingPrice: number;

  isSold: boolean;
}
