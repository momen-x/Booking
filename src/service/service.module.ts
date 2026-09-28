import { BadRequestException, Module } from "@nestjs/common";
import { ServiceAppService } from "./service.service";
import { ServiceController } from "./service.controller";
import { PrismaServiceRepository } from "./repo/prisma-services.repository";
import { ServiceRepository } from "./repo/service.repository";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { PrismaProviderProfileRepository } from "src/provider-profile/repo/prisma-provider-profile.repository";
import { ProviderProfileRepository } from "src/provider-profile/repo/provider-profile.repository";
import { memoryStorage } from "multer";
import { MulterModule } from "@nestjs/platform-express";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { UserRepository } from "src/users/repo/user.repository";
import { PrismaUserRepository } from "src/users/repo/prisma-user.repository";
import { NotificationsRepository } from "src/notifications/repo/notifications.repository";
import { PrismaNotificationsRepository } from "src/notifications/repo/prisma-notifications.repository";

@Module({
  controllers: [ServiceController],
  providers: [
    ServiceAppService,
    {
      provide: ServiceRepository,
      useClass: PrismaServiceRepository,
    },
    {
      provide: ProviderProfileRepository,
      useClass: PrismaProviderProfileRepository,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
    CloudinaryService,
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
export class ServiceModule {}
