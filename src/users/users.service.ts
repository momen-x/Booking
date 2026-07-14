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
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { UserRole } from "@prisma/client";
import { BookingRepository } from "src/bookings/booking.repository";

@Injectable()
export class UsersService {
  constructor(
    private userRepo: UserRepository,
    private cloudinaryService: CloudinaryService,
    private bookingRepo: BookingRepository,
  ) {}
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

  // async remove(id: string) {
  //   const user = await this.checkIfUserExist(id);
  //   if (user.role === "ADMIN")
  //     throw new UnauthorizedException("this is Admin account");
  //   const deletingAccount = await this.userRepo.deleteUser(user.id);
  //   return this.mapper(deletingAccount);
  // }

  async remove(userId: string) {
    const user = await this.checkIfUserExist(userId);
    if (user.role === "ADMIN")
      throw new UnauthorizedException("this is Admin account");

    if (user.role === UserRole.PROVIDER) {
      const hasBookings = await this.bookingRepo.findBookingsByUserId(user.id);
      if (hasBookings) {
        throw new BadRequestException(
          "Cannot delete a provider who has existing bookings",
        );
      }
    }
    const deletingAccount = await this.userRepo.deleteUser(user.id);

    return this.mapper(deletingAccount);
  }
  async uploadUserImage(id: string, file: Express.Multer.File) {
    const user = await this.checkIfUserExist(id);
    if (!file) throw new BadRequestException("image is required");
    const image = await this.cloudinaryService.uploadFile(file);
    const userImageUrl = image.url;
    const updateUserImage = await this.userRepo.uploadUserImage(
      user.id,
      userImageUrl,
    );
    return this.mapper(updateUserImage);
  }
  async deleteUserImage(id: string) {
    const user = await this.checkIfUserExist(id);
    if (!user.userImage) {
      throw new NotFoundException("image not found");
    }
    await this.cloudinaryService.deleteFile(user.userImage);
    const deleteUserImage = await this.userRepo.deleteUserImage(user.id);
    return this.mapper(deleteUserImage);
  }
  private async checkIfUserExist(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException("the user does not exist");
    return user;
  }
  private mapper(user: User) {
    const { createdAt, email, id, role, username, userImage, updatedAt } = user;
    return {
      id,
      username,
      userImage,
      email,
      role,
      createdAt,
      updatedAt,
    };
  }
}
