import { UserRole } from "@prisma/client";

export class User {
  constructor(
    public id: string,
    public email: string,
    public username: string,
    public password: string,
    public role: UserRole,
    public createdAt: Date,
  ) {}
}
// export class UserDto {
//   constructor(public username: string) {}
// }
// export class PasswordDto {
//   constructor(public password: string) {}
// }
