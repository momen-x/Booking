import { Module } from "@nestjs/common";
import { AvailabilityService } from "./availability.service";
import { AvailabilityController } from "./availability.controller";
import { AvailabilityRepository } from "./availability.repository";
import { PrismaAvailabilityRepository } from "./prisma-availability.repository";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { ProviderProfileRepository } from "src/provider-profile/provider-profile.repository";
import { PrismaProviderProfileRepository } from "src/provider-profile/prisma-provider-profile.repository";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";

@Module({
  controllers: [AvailabilityController],
  providers: [
    AvailabilityService,
    {
      provide: AvailabilityRepository,
      useClass: PrismaAvailabilityRepository,
    },
    {
      provide: ProviderProfileRepository,
      useClass: PrismaProviderProfileRepository,
    },
  ],
  imports: [PrismaModule, UsersModule, JwtModule],
})
export class AvailabilityModule {}
