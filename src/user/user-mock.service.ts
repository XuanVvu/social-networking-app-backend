import { UserDto } from 'src/user.dto';
export class UserMockService {
  create(user: UserDto) {
    return {
      name: 'mock name',
      password,
    };
  }
}
