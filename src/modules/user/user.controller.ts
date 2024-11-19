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
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { CurrentUser } from '@/shared/decorator/currentUser.decorator';
import { AuthGuard } from '@/shared/guards/auth.guard';
import {
  imageFileFilter,
  storageConfig,
} from '@/shared/helpers/uploadFileConfig.helper';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginUser.dto';
import { RegisterUserDto } from './dto/registerUser.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from '@/modules/user/dto/updateUser.dto';
import { ChangePasswordDto } from '@/modules/user/dto/ChangePassword.dto';

@Controller('api/v1/users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get()
  getAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get('/current-user')
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserById(id);
  }

  @Post('/register')
  registerUser(@Body() requestBody: RegisterUserDto) {
    return this.authService.register(requestBody);
  }

  @Post('/login')
  async loginUser(@Body() requestBody: LoginDto) {
    const result = (await this.authService.login(requestBody)) as any;
    if (!result.success) {
      return {
        success: false,
        message: 'Thông tin đăng nhập không chính xác',
      };
    }
    return {
      success: true,
      message: 'Đăng nhập thành công',
      data: result.data,
    };
  }

  // @Put('/update/:id')
  // @UseGuards(AuthGuard)
  // updateUser(
  //   @Param('id', ParseIntPipe) id: number,
  //   @CurrentUser() currentUser: User,
  //   @Body() updateUser: User,
  // ) {
  //   return this.userService.updateUser(id, updateUser, currentUser);
  // }

  @Delete('/delete/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @Put('/update/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('avatar', 1, {
      storage: storageConfig('avatars'),
      fileFilter: imageFileFilter,
    }),
  )
  async updateUser(
    @Req() req: any,
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles() avatar: Array<Express.Multer.File>,
    @CurrentUser() currentUser: User,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }

    updateUserDto.avatar = avatar;
    return await this.userService.updateUser(id, updateUserDto, currentUser);
  }

  @Post('/upload-avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storageConfig('avatar'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extention type. Accepted file ext are: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = `File size is too large. Accepted file size is less than 5MB`;
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uploadAvatar(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: User,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    return this.userService.updateAvatar(
      currentUser,
      file.destination + '/' + file.filename,
    );
  }

  @Put('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: User,
  ) {
    return await this.userService.changePassword(user, changePasswordDto);
  }
}
