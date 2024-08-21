import { FriendService } from '@/modules/friend/friend.service';
import { NotificationGateway } from '@/modules/notification/notification-gateway';
import { User } from '@/modules/user/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Notification])],
  providers: [NotificationGateway, NotificationService, FriendService],
})
export class NotificationModule {}
