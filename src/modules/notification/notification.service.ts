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
  ) {}

  async createNotification(
    userId: number,
    message: string,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      user: { id: userId } as User,
      message,
    });
    return this.notificationRepository.save(notification);
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user: { id: userId }, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: number): Promise<void> {
    await this.notificationRepository.update(notificationId, { isRead: true });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { user: { id: userId }, isRead: false },
      { isRead: true },
    );
  }

  async deleteNotification(notificationId: number): Promise<void> {
    await this.notificationRepository.delete(notificationId);
  }

  async deleteAllNotifications(userId: number): Promise<void> {
    await this.notificationRepository.delete({ user: { id: userId } });
  }
}
