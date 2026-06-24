import { CreateNotificationDTO } from "./dto/create-notifications.dto";
import { UpdateNotificationDTO } from "./dto/update-notifications.dto";
import { Notification } from "./entity/notifications.entity";

export abstract class NotificationsRepository {
  abstract create(
    userId: string,
    dto: CreateNotificationDTO,
  ): Promise<Notification>;
  abstract findAllByUserId(userId: string): Promise<Notification[]>;
  abstract findById(id: string): Promise<Notification | null>;
  abstract update(
    id: string,
    data: UpdateNotificationDTO,
  ): Promise<Notification>;
  abstract updateManyByUserId(
    userId: string,
    data: UpdateNotificationDTO,
  ): Promise<any>;
}
