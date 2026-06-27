import { Module } from "@nestjs/common";
import { ProviderProfileService } from "./provider-profile.service";
import { ProviderProfileController } from "./provider-profile.controller";
import { ProviderProfileRepository } from "./provider-profile.repository";
import { PrismaProviderProfileRepository } from "./prisma-provider-profile.repository";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { UserRepository } from "src/users/user.repository";
import { PrismaUserRepository } from "src/users/prisma-user.repository";
import { NotificationsRepository } from "src/notifications/notifications.repository";
import { PrismaNotificationsRepository } from "src/notifications/prisma-notifications.repository";
import { ProviderRequestRepository } from "src/provider-request/provider-request.repository";
import { PrismaProviderRequestRepository } from "src/provider-request/prisma-provider-request.repository";

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
