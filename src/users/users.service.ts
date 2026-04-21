import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserRepository } from "./user.repository";
import {
  UpdateUserPasswordByAdminDto,
  UpdateUserPasswordDto,
} from "./dto/update-user.dto";
import * as bcrypt from "bcryptjs";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(private userRepo: UserRepository) {}
  async findAll() {
    const users = await this.userRepo.getAllUsers();
    return users.map((user) => this.mapper(user));
  }

  async findOneById(id: string) {
    const user = await this.checkIfUserExist(id);
    return this.mapper(user);
  }
  async findOneByEmail(email: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new NotFoundException("the user not found");
    return this.mapper(user);
  }

  async updateUsername(id: string, username: string) {
    await this.checkIfUserExist(id);
    const updateUser = await this.userRepo.updateUserName(id, username);
    return this.mapper(updateUser);
  }
  async updatePassword(id: string, dto: UpdateUserPasswordDto) {
    const user = await this.checkIfUserExist(id);
    const { oldPassword, password, confirmPassword } = dto;
    if (password !== confirmPassword)
      throw new BadRequestException("Passwords do not match");

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch)
      throw new BadRequestException("Current password is incorrect");
    const hashedPassword = await bcrypt.hash(password, 12);

    const updateUserPassword = await this.userRepo.updatePassword(
      id,
      hashedPassword,
    );
    return this.mapper(updateUserPassword);
  }

  async updatePasswordByAdmin(dto: UpdateUserPasswordByAdminDto) {
    const { password, email } = dto;
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new NotFoundException("user not found");
    const hashedPassword = await bcrypt.hash(password, 12);
    const updateUserPassword = await this.userRepo.updatePassword(
      user.id,
      hashedPassword,
    );

    return this.mapper(updateUserPassword);
  }

  async remove(id: string) {
    const user = await this.checkIfUserExist(id);
    if (user.role === "ADMIN")
      throw new UnauthorizedException("this is Admin account");
    const deletingAccount = await this.userRepo.deleteUser(user.id);
    return this.mapper(deletingAccount);
  }
  // async currentUser(userId: string) {
  //   const currentUser = await this.userRepo.getCurrentUser(userId);
  //   if (!currentUser)
  //     throw new NotFoundException("this user is does not exist");
  //   return this.mapper(currentUser);
  // }
  private async checkIfUserExist(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException("the user does not exist");
    return user;
  }
  private mapper(user: User) {
    const { createdAt, email, id, role, username } = user;
    return {
      id,
      username,
      email,
      role,
      createdAt,
    };
  }
}
