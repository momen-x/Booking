import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { UserRepository } from "./user.repository";
import { RegisterUserDto } from "./dto/register-auth.dto";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    }) as Promise<User | null>;
  }

  async create(data: RegisterUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
}
