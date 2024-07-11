import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { CurrentUser } from '@/shared/decorator/currentUser.decorator';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { RoleGuard } from '@/shared/guards/role.guard';
import { storageConfig } from '@/shared/helpers/uploadFileConfig.helper';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginUser.dto';
import { RegisterUserDto } from './dto/registerUser.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { HttpExceptionFilter } from '@/shared/helpers/HttpExceptionFilter';

@Controller('api/v1/users')
// @UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get()
  @UseGuards(new RoleGuard(['admin']))
  @UseGuards(AuthGuard)
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
    console.log(result);

    if (!result.success) {
      // Xử lý lỗi đăng nhập (ví dụ: sai mật khẩu)
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

  @Put('/update/:id')
  @UseGuards(AuthGuard)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
    @Body() updateUser: User,
  ) {
    return this.userService.updateUser(id, updateUser, currentUser);
  }

  @Delete('/delete/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
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
}
