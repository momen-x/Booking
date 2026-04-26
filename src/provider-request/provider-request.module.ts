import { Module } from "@nestjs/common";
import { ProviderRequestService } from "./provider-request.service";
import { ProviderRequestController } from "./provider-request.controller";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { ProviderRequestRepository } from "./provider-request.repository";
import { PrismaProviderRequestRepository } from "./prisma-provider-request.repository";
import { UserRepository } from "src/users/user.repository";
import { PrismaUserRepository } from "src/users/prisma-user.repository";

@Module({
  controllers: [ProviderRequestController],
  providers: [
    ProviderRequestService,
    {
      provide: ProviderRequestRepository,
      useClass: PrismaProviderRequestRepository,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  imports: [PrismaModule, UsersModule, JwtModule],
})
export class ProviderRequestModule {}
