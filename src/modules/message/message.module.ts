import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { ChatModule } from '../chat/chat.module';
import { UserService } from '@/modules/user/user.service';
import { User } from '@/modules/user/user.entity';
import { ChatService } from '@/modules/chat/chat.service';
import { Chat } from '@/modules/chat/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Chat]), ChatModule],
  providers: [MessageService, MessageGateway, UserService, ChatService],
  controllers: [MessageController],
})
export class MessageModule {}
