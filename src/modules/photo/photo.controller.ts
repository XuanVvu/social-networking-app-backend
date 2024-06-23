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
  UseInterceptors,
} from '@nestjs/common';
import { PhotoDto } from './photo.dto';
import { PhotoService } from './photo.service';

@Controller('photos')
@UseInterceptors(ClassSerializerInterceptor)
export class PhotoController {
  constructor(private photoService: PhotoService) {}

  @Post()
  createPhoto(@Body() requestBody: PhotoDto) {
    return this.photoService.create(requestBody);
  }

  @Get()
  getAllPhotos() {
    return this.photoService.findAll();
  }

  @Get(':id')
  async getPhotoById(@Param('id', ParseIntPipe) id: number) {
    return await this.photoService.findPhotoById(id);
  }

  @Delete(':id')
  async deletePhoto(@Param('id', ParseIntPipe) id: number) {
    return this.photoService.deletePhoto(id);
  }

  @Put(':id')
  updatePhoto(@Param('id', ParseIntPipe) id: number, @Body() body: PhotoDto) {
    body.createdAt = new Date();
    body.updatedAt = new Date();
    body.deletedAt = new Date();
    // return this.photoService.updatePhoto(id, body);
  }
}
