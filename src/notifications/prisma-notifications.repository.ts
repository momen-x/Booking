import { Injectable } from "@nestjs/common";
import { NotificationsRepository } from "./notifications.repository";
import { CreateNotificationDTO } from "./dto/create-notifications.dto";
import { Notification } from "./entity/notifications.entity";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { UpdateNotificationDTO } from "./dto/update-notifications.dto";

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(userId: string, dto: CreateNotificationDTO): Promise<Notification> {
    return this.prisma.notification.create({
      data: { ...dto, userId },
    });
  }
  findAllByUserId(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  findById(id: string): Promise<Notification | null> {
    return this.prisma.notification.findUnique({ where: { id } });
  }
  update(id: string, data: UpdateNotificationDTO): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data,
    });
  }
  updateManyByUserId(
    userId: string,
    data: UpdateNotificationDTO,
  ): Promise<any> {
    return this.prisma.notification.updateMany({
      where: { userId },
      data,
    });
  }
}
