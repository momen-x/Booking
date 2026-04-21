import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { updateBookingStatus } from "./dto/update-booking.dto";
import { AuthenticatedUser } from "src/users/decorator/authenticated-user.decorator";
import { UserRole } from "@prisma/client";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Roles } from "src/users/decorator/user-role.decorator";

@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 201, description: "Booking created successfully" })
  @ApiOperation({ summary: "Create a new booking" })
  create(
    @Body()
    createBookingDto: {
      providerId: string;
      serviceId: string;
      date: Date;
      startTime: Date;
      endTime: Date;
    },
    @AuthenticatedUser()
    user: { id: string; sub: string; email: string; role: UserRole },
  ) {
    const dto = {
      userId: user.id,
      ...createBookingDto,
    };
    return this.bookingsService.create(user.id, dto);
  }

  @Get("user/:userId")
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Get all bookings for a user" })
  @ApiOperation({ summary: "Get all bookings for a user" })
  findByUserId(@Param("userId") userId: string) {
    return this.bookingsService.findAllByUserId(userId);
  }

  @Get("my-bookings")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Get all my bookings" })
  @ApiOperation({ summary: "Get all my bookings" })
  findMyBookings(@AuthenticatedUser() user: { id: string; role: UserRole }) {
    return this.bookingsService.findAllByUserId(user.id);
  }
  @Get("provider/:providerId")
  @ApiResponse({ status: 200, description: "Get all bookings for a provider" })
  @ApiOperation({ summary: "Get all bookings for a provider" })
  @UseGuards(AuthGuard("jwt"))
  findByProviderId(
    @Param("providerId") providerId: string,
    @AuthenticatedUser() user: { id: string; role: UserRole },
  ) {
    return this.bookingsService.findAllByProviderId(
      providerId,
      user.id,
      user.role,
    );
  }

  @Get(":id")
  @ApiResponse({ status: 200, description: "Get booking by ID" })
  @ApiOperation({ summary: "Get booking by ID" })
  findOne(@Param("id") id: string) {
    return this.bookingsService.findOne(id);
  }

  @Put(":id")
  @Roles(UserRole.PROVIDER)
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Booking status updated" })
  @ApiOperation({ summary: "Update booking status" })
  update(@Param("id") id: string, @Body() dto: updateBookingStatus) {
    const { status } = dto;
    return this.bookingsService.updateStatus(id, status);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Booking cancelled successfully" })
  @ApiOperation({ summary: "Cancel a booking" })
  remove(
    @Param("id") id: string,
    @AuthenticatedUser() user: { id: string; role: UserRole },
  ) {
    return this.bookingsService.remove(id, user.id, user.role);
  }
}
