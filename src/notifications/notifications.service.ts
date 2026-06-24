import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { NotificationsRepository } from "./notifications.repository";
import { CreateNotificationDTO } from "./dto/create-notifications.dto";
import { UserRepository } from "src/users/user.repository";

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepo: NotificationsRepository,
    private readonly userRepo: UserRepository,
  ) {}

  findAll(userId: string) {
    return this.notificationRepo.findAllByUserId(userId);
  }

  async findOne(id: string, userId: string) {
    const notification = await this.notificationRepo.findById(id);
    if (!notification) throw new NotFoundException("Notification not found");
    if (notification.userId !== userId)
      throw new ForbiddenException(
        "You are not authorized to view this notification",
      );
    return notification;
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.findOne(id, userId);
    return this.notificationRepo.update(notification.id, { isRead: true });
  }

  markAllAsRead(userId: string) {
    return this.notificationRepo.updateManyByUserId(userId, { isRead: true });
  }

  // this service will Called in the  other services (booking, provider request, etc.)
  async create(userId: string, dto: CreateNotificationDTO) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException("User not found");
    const updateNotification = await this.notificationRepo.create(userId, dto);
    return updateNotification;
  }
}
