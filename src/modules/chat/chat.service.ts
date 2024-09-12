import { User } from '@/modules/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createChat(user1Id: number, user2Id: number): Promise<Chat> {
    let chat = await this.chatRepository.findOne({
      where: [
        { user1: { id: user1Id }, user2: { id: user2Id } },
        { user1: { id: user2Id }, user2: { id: user1Id } },
      ],
    });

    if (!chat) {
      const user1 = await this.userRepository.findOne({
        where: { id: user1Id },
      });
      const user2 = await this.userRepository.findOne({
        where: { id: user2Id },
      });
      chat = this.chatRepository.create({ user1, user2 });
      await this.chatRepository.save(chat);
    }

    return chat;
  }

  async getChatsForUser(userId: number): Promise<Chat[]> {
    return this.chatRepository.find({
      where: [{ user1: { id: userId } }, { user2: { id: userId } }],
      relations: ['user1', 'user2'],
    });
  }

  async getChatForCurrentAndOtherUser(
    userId: number,
    currentUserId: number,
  ): Promise<Chat> {
    return await this.chatRepository.findOne({
      where: [
        { user1: { id: userId }, user2: { id: currentUserId } },
        { user1: { id: currentUserId }, user2: { id: userId } },
      ],
    });
  }
}
