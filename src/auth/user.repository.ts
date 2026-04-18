import { User } from "@prisma/client";
import { RegisterUserDto as Register } from "./entities/register.entity";

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(data: Register): Promise<User>;
}
