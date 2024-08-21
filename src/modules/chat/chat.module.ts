import { ChatGateway } from '@/modules/chat/chat-gateway';
import { Message } from '@/modules/chat/chat.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [TypeOrmModule.forFeature([Message])],
})
export class ChatModule {}
