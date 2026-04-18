// users.module.ts file
import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { JwtModule } from "@nestjs/jwt";
import { UserRepository } from "./user.repository";
import { PrismaUserRepository } from "./prisma-user.repository";
import { AuthRolesGuard } from "./role.guard";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    AuthRolesGuard,
  ],
  imports: [JwtModule, PrismaModule],
  exports: [UsersService, AuthRolesGuard],
})
export class UsersModule {}
