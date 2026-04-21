import { User } from "./entities/user.entity";
export abstract class UserRepository {
  abstract updateUserName(id: string, username: string): Promise<User>;
  abstract updatePassword(id: string, password: string): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract getAllUsers(): Promise<User[]>;
  abstract deleteUser(id: string): Promise<User>;
}
