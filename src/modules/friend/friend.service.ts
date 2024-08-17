import { User } from '@/modules/user/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './friend.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async sendFriendRequest(requesterId: number, recipientId: number) {
    const requester = await this.userRepository.findOneBy({ id: requesterId });
    const recipient = await this.userRepository.findOneBy({
      id: recipientId,
    });

    const newFriendRequest = this.friendRepository.create({
      requester,
      recipient,
      status: 'pending',
    });

    return this.friendRepository.save(newFriendRequest);
  }

  async acceptFriendRequest(friendRequestId: number, currentUserId: number) {
    const friendRequest = await this.friendRepository.findOne({
      where: {
        requester: {
          id: friendRequestId,
        },
        recipient: {
          id: currentUserId,
        },
        status: 'pending',
      },
      relations: ['requester', 'recipient'],
    });
    friendRequest.status = 'accepted';
    return this.friendRepository.save(friendRequest);
  }

  async rejectFriendRequest(friendRequestId: number, currentUserId: number) {
    const friendRequest = await this.friendRepository.findOne({
      where: {
        requester: {
          id: friendRequestId,
        },
        recipient: {
          id: currentUserId,
        },
        status: 'pending',
      },
      relations: ['requester', 'recipient'],
    });
    return this.friendRepository.remove(friendRequest);
  }

  async getFriendships(
    userId: number,
    status: 'pending' | 'accepted' | 'sent',
  ) {
    switch (status) {
      case 'pending':
        return this.friendRepository.find({
          where: {
            recipient: { id: userId },
            status: 'pending',
          },
          relations: ['requester', 'recipient'],
        });
      case 'accepted':
        return this.friendRepository.find({
          where: [
            { requester: { id: userId }, status: 'accepted' },
            { recipient: { id: userId }, status: 'accepted' },
          ],
          relations: ['requester', 'recipient'],
        });
      case 'sent':
        return this.friendRepository.find({
          where: { requester: { id: userId }, status: 'pending' },
          relations: ['recipient'],
        });
      default:
        throw new BadRequestException('Invalid status');
    }
  }

  async cancelFriendRequest(requesterId: number, recipientId: number) {
    const friendRequest = await this.friendRepository.findOne({
      where: {
        requester: { id: requesterId },
        recipient: { id: recipientId },
        status: 'pending',
      },
    });

    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }

    await this.friendRepository.remove(friendRequest);
  }

  async removeFriend(userId: number, friendId: number) {
    const friendship = await this.friendRepository.findOne({
      where: [
        {
          requester: { id: userId },
          recipient: { id: friendId },
          status: 'accepted',
        },
        {
          requester: { id: friendId },
          recipient: { id: userId },
          status: 'accepted',
        },
      ],
    });

    if (!friendship) {
      throw new NotFoundException('Friendship not found');
    }

    await this.friendRepository.remove(friendship);
  }
}
