import { UserRole } from "@prisma/client";

export class User {
  constructor(
    public id: string,
    public email: string,
    public username: string,
    public userImage: string | null,
    public password: string,
    public role: UserRole,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
