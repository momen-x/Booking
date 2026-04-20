import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from "@nestjs/common";
import { AvailabilityService } from "./availability.service";
import { CreateAvailabilityDto } from "./dto/create-availability.dto";
import { UpdateAvailabilityDto } from "./dto/update-availability.dto";
import { AuthenticatedUser } from "src/users/decorator/authenticated-user.decorator";
import { UserRole } from "@prisma/client";
import { Roles } from "src/users/decorator/user-role.decorator";
import { AuthGuard } from "@nestjs/passport";
import { AuthRolesGuard } from "src/users/role.guard";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("availability")
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: "Availability created successfully",
  })
  @ApiOperation({ summary: "Create a new availability slot" })
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  create(
    @Body() createAvailabilityDto: CreateAvailabilityDto,
    @AuthenticatedUser()
    user: { id: string; email: string; role: UserRole },
  ) {
    return this.availabilityService.create(
      user.id,
      user.role,
      createAvailabilityDto,
    );
  }

  @Get("provider/:providerId")
  @ApiResponse({
    status: 200,
    description: "Get all availabilities for a provider",
  })
  @ApiOperation({ summary: "Get all availabilities for a provider" })
  findAllAvailabilitiesByProvider(@Param("providerId") providerId: string) {
    return this.availabilityService.findAllByProvider(providerId);
  }

  @Get(":id")
  @ApiResponse({
    status: 200,
    description: "Get availability by ID",
  })
  @ApiOperation({ summary: "Get availability by ID" })
  findOne(@Param("id") id: string) {
    return this.availabilityService.findOne(id);
  }

  @Put(":id")
  @ApiResponse({
    status: 200,
    description: "Availability updated successfully",
  })
  @ApiOperation({ summary: "Update an existing availability slot" })
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  update(
    @Param("id") id: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
    @AuthenticatedUser()
    user: { id: string; email: string; role: UserRole },
  ) {
    return this.availabilityService.update(
      id,
      user.id,
      user.role,
      updateAvailabilityDto,
    );
  }

  @Delete(":id")
  @ApiResponse({
    status: 200,
    description: "Availability deleted successfully",
  })
  @ApiOperation({ summary: "Delete an availability slot" })
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  remove(
    @Param("id") id: string,
    @AuthenticatedUser()
    user: { id: string; email: string; role: UserRole },
  ) {
    return this.availabilityService.remove(id, user.id, user.role);
  }
}
