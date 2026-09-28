import { Module } from "@nestjs/common";
import { ProviderProfileService } from "./provider-profile.service";
import { ProviderProfileController } from "./provider-profile.controller";
import { ProviderProfileRepository } from "./repo/provider-profile.repository";
import { PrismaProviderProfileRepository } from "./repo/prisma-provider-profile.repository";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { UserRepository } from "src/users/repo/user.repository";
import { PrismaUserRepository } from "src/users/repo/prisma-user.repository";
import { NotificationsRepository } from "src/notifications/repo/notifications.repository";
import { PrismaNotificationsRepository } from "src/notifications/repo/prisma-notifications.repository";
import { ProviderRequestRepository } from "src/provider-request/repo/provider-request.repository";
import { PrismaProviderRequestRepository } from "src/provider-request/repo/prisma-provider-request.repository";

@Module({
  controllers: [ProviderProfileController],
  imports: [PrismaModule, UsersModule, JwtModule],
  providers: [
    ProviderProfileService,
    {
      provide: ProviderProfileRepository,
      useClass: PrismaProviderProfileRepository,
    },
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
})
export class ProviderProfileModule {}
