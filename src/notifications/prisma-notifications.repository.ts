import { Injectable } from "@nestjs/common";
import { NotificationsRepository } from "./notifications.repository";
import { CreateNotificationDTO } from "./dto/create-notifications.dto";
import { Notification } from "./entity/notifications.entity";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

@Injectable()
export class PrismaProviderRequestRepository implements NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(userId: string, dto: CreateNotificationDTO): Promise<Notification> {
    return this.prisma.notification.create({
      data: { ...dto, userId },
    });
  }
  findAllByUserId(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({ where: { userId } });
  }
  findById(id: string): Promise<Notification | null> {
    return this.prisma.notification.findUnique({ where: { id } });
  }
  update(id: string, data: { isRead: boolean }): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data,
    });
  }
  updateManyByUserId(userId: string, data: { isRead: boolean }): Promise<any> {
    return this.prisma.notification.updateMany({
      where: { userId },
      data,
    });
  }
}
