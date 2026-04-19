import { Module } from "@nestjs/common";
import { ServiceAppService } from "./service.service";
import { ServiceController } from "./service.controller";
import { PrismaServiceRepository } from "./prisma-services.repository";
import { ServiceRepository } from "./service.repository";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { PrismaProviderProfileRepository } from "src/provider-profile/prisma-provider-profile.repository";
import { ProviderProfileRepository } from "src/provider-profile/provider-profile.repository";

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
  ],
  imports: [PrismaModule, UsersModule, JwtModule],
})
export class ServiceModule {}
