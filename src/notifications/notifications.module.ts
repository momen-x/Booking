import { Module } from "@nestjs/common";
import { NotificationService } from "./notifications.service";
import { NotificationController } from "./notifications.controller";
import { NotificationsRepository } from "./repo/notifications.repository";
import { UserRepository } from "src/users/repo/user.repository";
import { PrismaUserRepository } from "src/users/repo/prisma-user.repository";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { PrismaNotificationsRepository } from "./repo/prisma-notifications.repository";

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService,
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    CloudinaryService,
  ],
  imports: [PrismaModule, UsersModule, JwtModule],
})
export class NotificationModule {}
