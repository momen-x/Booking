import { CreateNotificationDTO } from "./dto/create-notifications.dto";
import { Notification } from "./entity/notifications.entity";

export abstract class NotificationsRepository {
  abstract create(userId: string, dto: CreateNotificationDTO): Promise<any>;
  abstract findAllByUserId(userId: string): Promise<Notification[]>;
  abstract findById(id: string): Promise<Notification | null>;
  abstract update(id: string, data: { isRead: boolean }): Promise<Notification>;
  abstract updateManyByUserId(
    userId: string,
    data: { isRead: boolean },
  ): Promise<any>;
}
