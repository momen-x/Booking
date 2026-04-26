import { Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import { NotificationService } from "./notifications.service";
import { AuthGuard } from "@nestjs/passport";
import { AuthenticatedUser } from "src/users/decorator/authenticated-user.decorator";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  //todo access!!
  @Get()
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Get all notifications" })
  @ApiOperation({ summary: "Get all notifications" })
  findAll(@AuthenticatedUser() user: { id: string }) {
    return this.notificationService.findAll(user.id);
  }

  @Get(":id")
  @ApiResponse({ status: 200, description: "Get single notification" })
  @ApiOperation({ summary: "Get single notification" })
  @UseGuards(AuthGuard("jwt"))
  findOne(@Param("id") id: string, @AuthenticatedUser() user: { id: string }) {
    return this.notificationService.findOne(id, user.id);
  }

  @Put(":id/read")
  @ApiResponse({
    status: 200,
    description: "Update read status of notification",
  })
  @UseGuards(AuthGuard("jwt"))
  markAsRead(
    @Param("id") id: string,
    @AuthenticatedUser() user: { id: string },
  ) {
    return this.notificationService.markAsRead(id, user.id);
  }

  @Put("read-all")
  @ApiResponse({
    status: 200,
    description: "Update read status of notification",
  })
  @UseGuards(AuthGuard("jwt"))
  markAllAsRead(@AuthenticatedUser() user: { id: string }) {
    return this.notificationService.markAllAsRead(user.id);
  }
}
