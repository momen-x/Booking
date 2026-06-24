import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { NotificationService } from "./notifications.service";
import { AuthGuard } from "@nestjs/passport";
import { AuthenticatedUser } from "src/users/decorator/authenticated-user.decorator";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthRolesGuard } from "src/users/role.guard";
import { CreateNotificationDTO } from "./dto/create-notifications.dto";

@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  @ApiResponse({ status: 200, description: "Get all notifications" })
  @ApiOperation({ summary: "Get all notifications" })
  findAll(@AuthenticatedUser() user: { id: string }) {
    return this.notificationService.findAll(user.id);
  }

  @Get(":id")
  @ApiResponse({ status: 200, description: "Get single notification" })
  @ApiOperation({ summary: "Get single notification" })
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  findOne(@Param("id") id: string, @AuthenticatedUser() user: { id: string }) {
    return this.notificationService.findOne(id, user.id);
  }

  @Put(":id/read")
  @ApiResponse({
    status: 200,
    description: "Update read status of notification",
  })
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
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
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  markAllAsRead(@AuthenticatedUser() user: { id: string }) {
    return this.notificationService.markAllAsRead(user.id);
  }

  @Post(":userId")
  @ApiResponse({ status: 201, description: "add new notification" })
  @ApiOperation({ summary: "add new notification" })
  create(@Param("userId") userId: string, @Body() dto: CreateNotificationDTO) {
    return this.notificationService.create(userId, dto);
  }
}
