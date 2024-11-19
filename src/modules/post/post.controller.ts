import { imageFileFilter } from '@/shared/helpers/uploadFileConfig.helper';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { PostService } from './post.service';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from '@/modules/post/dto/createPostDto';
import { CurrentUser } from '@/shared/decorator/currentUser.decorator';
import { User } from '@/modules/user/user.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { storageConfig } from '@/shared/helpers/uploadFileConfig.helper';
import { UpdatePostDto } from '@/modules/post/dto/updatePostDto';

@Controller('api/v1/post')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(private postService: PostService) {}

  @Get('')
  async getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get('/search')
  searchPosts(@Query('query') query: string) {
    return this.postService.searchPosts(query);
  }

  @Get('/:id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findPostById(id);
  }

  @Get('/postByUserId/:userId')
  async getPostByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.postService.findPostByUserId(userId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: storageConfig('posts'),
      fileFilter: imageFileFilter,
    }),
  )
  async createPost(
    @Req() req: any,
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() currentUser: User,
    @UploadedFiles() photos: Array<Express.Multer.File>,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!photos || photos.length === 0) {
      throw new BadRequestException('Please upload at least one photo.');
    }
    const postData = {
      ...createPostDto,
      photos: photos,
    };
    return this.postService.createPost(postData, currentUser);
  }

  @Put('/update/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: storageConfig('posts'),
      fileFilter: imageFileFilter,
    }),
  )
  async updatePost(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles() photosToAdd: Array<Express.Multer.File>,
    @CurrentUser() currentUser: User,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    updatePostDto.photosToAdd = photosToAdd;
    return await this.postService.updatePost(id, updatePostDto, currentUser);
  }

  @Delete('/delete/:id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return await this.postService.deletePost(id, currentUser);
  }
}
