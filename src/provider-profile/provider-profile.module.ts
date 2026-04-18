import { Module } from "@nestjs/common";
import { ProviderProfileService } from "./provider-profile.service";
import { ProviderProfileController } from "./provider-profile.controller";
import { ProviderProfileRepository } from "./provider-profile.repository";
import { PrismaProviderProfileRepository } from "./prisma-provider-profile.repository";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  controllers: [ProviderProfileController],
  imports: [PrismaModule, UsersModule, JwtModule],
  providers: [
    ProviderProfileService,
    {
      provide: ProviderProfileRepository,
      useClass: PrismaProviderProfileRepository,
    },
  ],
})
export class ProviderProfileModule {}
