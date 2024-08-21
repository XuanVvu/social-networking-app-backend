import { User } from '@/modules/user/user.entity';
import { Notification } from '@/modules/notification/notification.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createNotification(
    recipientId: number,
    type: string,
    content: string,
    relatedItemId?: number,
  ): Promise<Notification> {
    const recipient = await this.userRepository.findOne({
      where: { id: recipientId },
    });
    const notification = this.notificationRepository.create({
      recipient,
      type,
      content,
      relatedItemId,
    });
    return this.notificationRepository.save(notification);
  }

  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { recipient: { id: userId }, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: number): Promise<void> {
    await this.notificationRepository.update(notificationId, { isRead: true });
  }
}
