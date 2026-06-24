import { BadRequestException, Module } from "@nestjs/common";
import { ProviderRequestService } from "./provider-request.service";
import { ProviderRequestController } from "./provider-request.controller";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { ProviderRequestRepository } from "./provider-request.repository";
import { PrismaProviderRequestRepository } from "./prisma-provider-request.repository";
import { UserRepository } from "src/users/user.repository";
import { PrismaUserRepository } from "src/users/prisma-user.repository";
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { CloudinaryService } from "src/config/cloudinary.service";
import { NotificationsRepository } from "src/notifications/notifications.repository";
import { PrismaNotificationsRepository } from "src/notifications/prisma-notifications.repository";

@Module({
  controllers: [ProviderRequestController],
  providers: [
    ProviderRequestService,
    CloudinaryService,
    {
      provide: ProviderRequestRepository,
      useClass: PrismaProviderRequestRepository,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  imports: [
    PrismaModule,
    UsersModule,
    JwtModule,
    MulterModule.register({
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(new BadRequestException("Invalid file type"), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  ],
})
export class ProviderRequestModule {}
