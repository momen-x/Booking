// users.controller.ts file
import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Post,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserRole } from "@prisma/client";
import { AuthRolesGuard } from "./role.guard";
import { Roles } from "./decorator/user-role.decorator";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import {
  UpdateUsername,
  UpdateUserPasswordByAdminDto,
  UpdateUserPasswordDto,
} from "./dto/update-user.dto";
import { CurrentUser } from "./decorator/current-user.decorator";
import { AuthenticatedUser } from "./decorator/authenticated-user.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageUploadDto } from "./dto/upload-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({ status: 200, description: "get all users" })
  @ApiOperation({ summary: "get all users, just admin can get all users" })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get("current-user")
  @ApiResponse({ status: 200, description: "get data for the current user" })
  @ApiOperation({ summary: "get current user" })
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.PROVIDER)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  async getCurrentUser(
    @AuthenticatedUser()
    user: {
      id: string;
    },
  ) {
    return await this.usersService.findOneById(user.id);
  }

  @Put("update-username")
  @ApiResponse({ status: 200, description: "username updated successfully" })
  @ApiOperation({ summary: "update user username" })
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  updateUsername(
    @CurrentUser()
    user: { id: string; email?: string } | undefined,
    @Body() dto: UpdateUsername,
  ) {
    return this.usersService.updateUsername(user?.id ?? "", dto.username);
  }

  @Put("update-password")
  @ApiResponse({ status: 200, description: "password updated successfully" })
  @ApiOperation({ summary: "update user password" })
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.PROVIDER)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  updatePassword(
    @CurrentUser()
    user: { id: string; email?: string } | undefined,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    return this.usersService.updatePassword(
      user?.id ?? "",
      updateUserPasswordDto,
    );
  }

  @Put("admin/password")
  @ApiResponse({ status: 200, description: "password updated successfully" })
  @ApiOperation({ summary: "update user password by admin" })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  updatePasswordByAdmin(
    @Body() updateUserPasswordDto: UpdateUserPasswordByAdminDto,
  ) {
    return this.usersService.updatePasswordByAdmin(updateUserPasswordDto);
  }

  @Delete()
  @ApiResponse({
    status: 200,
    description: "user account deleted successfully",
  })
  @ApiOperation({ summary: "delete user account" })
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.PROVIDER)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  remove(
    @CurrentUser()
    user: { id: string; email?: string } | undefined,
  ) {
    return this.usersService.remove(user?.id ?? "");
  }

  @Post("upload-image")
  @ApiResponse({ status: 201, description: "upload user image" })
  @ApiOperation({ summary: "upload user image" })
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor("user_image"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: ImageUploadDto, description: "profile image" })
  async uploadUserImage(
    @AuthenticatedUser()
    user: { id: string; email: string; role: UserRole },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.usersService.uploadUserImage(user.id, file);
  }

  @Delete("delete-image")
  @ApiResponse({ status: 200, description: "delete user image" })
  @ApiOperation({ summary: "delete user image" })
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  deleteUserImage(
    @AuthenticatedUser()
    user: {
      id: string;
      email: string;
      role: UserRole;
    },
  ) {
    return this.usersService.deleteUserImage(user.id);
  }
  //Admin section

  @Get(":id")
  @ApiResponse({ status: 200, description: "get user by ID" })
  @ApiOperation({ summary: "get user by ID" })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  findOne(@Param("id") id: string) {
    return this.usersService.findOneById(id);
  }
  /**
   * @route PUT ~/api/users/:id/username
   * @description update user username account by the admin
   * @returns user data
   * @access private just the user admin can update the username  by this route
   */
  @Put(":id/username")
  @ApiResponse({ status: 200, description: "username updated successfully" })
  @ApiOperation({ summary: "update user username by admin" })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  updateUsernameByTheAdmin(
    @Param("id") id: string,
    @Body() dto: UpdateUsername,
  ) {
    return this.usersService.updateUsername(id, dto.username);
  }
  /**
   * @route DELETE ~/api/users/:id
   * @description delete user account by the Admin
   * @param id
   * @returns success message
   * @access private just the admin can delete the user account
   */
  @Delete(":id")
  @ApiResponse({
    status: 200,
    description: "user account deleted successfully by the admin",
  })
  @ApiOperation({ summary: "delete user account by the admin" })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  removeById(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
