// users.controller.ts file
import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserRole } from "@prisma/client";
import { AuthRolesGuard } from "./role.guard";
import { Roles } from "./decorator/user-role.decorator";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
  UpdateUsername,
  UpdateUserPasswordByAdminDto,
  UpdateUserPasswordDto,
} from "./dto/update-user.dto";
import { CurrentUser } from "./decorator/current-user.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //todo 1-check if the role, guard  and the decorator @CurrentUser   : decrypt the jwt cipher and make one logic

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
    @CurrentUser()
    user: { id: string; email?: string } | undefined,
  ) {
    return await this.usersService.currentUser(user?.id ?? "");
  }

  @Get(":id")
  @ApiResponse({ status: 200, description: "get user by ID" })
  @ApiOperation({ summary: "get user by ID" })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  findOne(@Param("id") id: string) {
    return this.usersService.findOneById(id);
  }
  /**
   * @route PUT ~/api/users/update-username
   * @description update user username by the user himself
   * @returns user data
   * @access private just the user himself can update own username
   */
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
   * @route PUT ~/api/users/update-password
   * @description update password user account by the user himself
   * @returns user data
   * @access private just the user himself can update own password account
   */
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
  /**
   * @route PUT ~/api/users/:id/password
   * @description update user password account by the admin
   * @returns user data
   * @access private just the user admin can update the user account by this route
   */
  @Put(":id/password")
  @ApiResponse({ status: 200, description: "password updated successfully" })
  @ApiOperation({ summary: "update user password by admin" })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  updatePasswordByAdmin(
    @Param("id") id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordByAdminDto,
  ) {
    return this.usersService.updatePasswordByAdmin(id, updateUserPasswordDto);
  }
  /**
   * @route DELETE ~/api/users
   * @description delete user by the user himself
   * @returns success message
   * @access private just the user himself can delete own account
   */
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
