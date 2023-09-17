import {
  Get,
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Inject,
} from '@nestjs/common';
import { UserDto } from '../user.dto';
import { UserService } from './user.service';
interface User {
  name: string;
  age: number;
}

@Controller('users')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UserService,
  ) {}

  @Get()
  getAllUsers(): User[] {
    return [
      {
        name: 'giang',
        age: 18,
      },
      {
        name: 'tung',
        age: 18,
      },
    ];
  }
  @Post()
  createUser(@Body() user: UserDto): UserDto {
    return this.userService.createUser(user);
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: string) {
    console.log('id----', id);

    return 'test';
  }
}
