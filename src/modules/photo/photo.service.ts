import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotoDto } from './photo.dto';
// import { PhotoDto } from './photo.dto';
import { Photo } from './photo.entity';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
  ) {}

  async findAll(): Promise<Photo[]> {
    return this.photoRepository.find();
  }

  async create(requestBody: PhotoDto) {
    requestBody.createdAt = new Date();
    requestBody.updatedAt = new Date();
    requestBody.deletedAt = new Date();
    const photo = await this.photoRepository.create(requestBody);
    return this.photoRepository.save(photo);
  }

  async findPhotoById(id: number): Promise<Photo> {
    const photo = await this.photoRepository.findOneBy({ id });
    if (!photo) {
      throw new HttpException('Photo does not exist', 404);
    }
    return photo;
  }

  async deletePhoto(id: number): Promise<Photo> {
    const photo = await this.findPhotoById(id);
    if (!photo) {
      throw new HttpException('Photo does not exist', 404);
    }
    return this.photoRepository.remove(photo);
  }

  async updatePhoto(id: number, photo: Photo): Promise<Photo> {
    const photoUPdate = await this.findPhotoById(id);
    if (!photoUPdate) {
      throw new HttpException('Photo does not exist', 404);
    }
    await this.photoRepository.update(id, photo);
    return this.photoRepository.findOneBy({ id });
  }
}
