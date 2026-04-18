import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import {
  UpdateUserPasswordByAdminDto,
  UpdateUserPasswordDto,
} from "./dto/update-user.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(private userRepo: UserRepository) {}
  findAll() {
    return this.userRepo.getAllUsers();
  }

  findOneById(id: string) {
    return this.userRepo.findById(id);
  }
  findOneByEmail(email: string) {
    return this.userRepo.findByEmail(email);
  }

  updateUsername(id: string, username: string) {
    return this.userRepo.updateUserName(id, username);
  }
  async updatePassword(
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    const isUserExist = await this.userRepo.findById(id);
    if (!isUserExist) throw new BadRequestException("User not found");
    const { oldPassword, password, confirmPassword } = updateUserPasswordDto;
    if (password !== confirmPassword)
      throw new BadRequestException("Passwords do not match");

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      isUserExist.password,
    );
    if (!isPasswordMatch)
      throw new BadRequestException("Current password is incorrect");
    const hashedPassword = await bcrypt.hash(password, 12);

    return this.userRepo.updatePassword(id, hashedPassword);
  }

  async updatePasswordByAdmin(
    id: string,
    updateUserPasswordByAdminDto: UpdateUserPasswordByAdminDto,
  ) {
    const { password } = updateUserPasswordByAdminDto;
    const hashedPassword = await bcrypt.hash(password, 12);

    return this.userRepo.updatePassword(id, hashedPassword);
  }

  remove(id: string) {
    return this.userRepo.deleteUser(id);
  }
  async currentUser(userId: string) {
    return this.userRepo.getCurrentUser(userId);
  }
}
