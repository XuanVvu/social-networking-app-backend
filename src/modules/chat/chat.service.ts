import { Message } from '@/modules/chat/chat.entity';
import { User } from '@/modules/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async saveMessage(
    senderId: number,
    receiverId: number,
    content: string,
  ): Promise<Message> {
    const message = this.messageRepository.create({
      senderId,
      receiverId,
      content,
    });
    return this.messageRepository.save(message);
  }

  async getUnreadMessages(userId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { receiverId: userId, isRead: false },
      order: { timestamp: 'ASC' },
    });
  }

  async markMessageAsRead(messageId: number): Promise<void> {
    await this.messageRepository.update(messageId, { isRead: true });
  }

  async getConversation(userId1: number, userId2: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
      order: { timestamp: 'ASC' },
    });
  }
}
