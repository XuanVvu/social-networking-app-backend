import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Chat } from '../chat/chat.entity';
import { User } from '../user/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async sendMessage(
    chatId: number,
    senderId: number,
    content: string,
  ): Promise<Message> {
    const chat = await this.chatRepository.findOne({ where: { id: chatId } });
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });
    const message = this.messageRepository.create({ chat, sender, content });
    return await this.messageRepository.save(message);
  }

  async getMessagesForChat(chatId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { chat: { id: chatId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }
}
