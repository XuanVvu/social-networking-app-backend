import { Friend } from '@/modules/friend/friend.entity';
import { FriendService } from '@/modules/friend/friend.service';
import { User } from '@/modules/user/user.entity';
import { UserService } from '@/modules/user/user.service';
import { LoggerService } from '@/shared/services/logger.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendController } from './friend.controller';
import { NotificationService } from '../notification/notification.service';
import { Notification } from '@/modules/notification/notification.entity';
@Module({
  controllers: [FriendController],
  providers: [FriendService, UserService, LoggerService, NotificationService],
  imports: [TypeOrmModule.forFeature([User, Friend, Notification])],
})
export class FriendModule {}
