import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { AuthRepository } from "./auth.repository";
import { RegisterUserDto } from "../dto/register-auth.dto";

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
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
