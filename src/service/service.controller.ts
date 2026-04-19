import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  UnauthorizedException,
} from "@nestjs/common";
import { ServiceAppService } from "./service.service";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { CurrentUser } from "src/users/decorator/current-user.decorator";
import { UserRole } from "@prisma/client";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Roles } from "src/users/decorator/user-role.decorator";
import { AuthGuard } from "@nestjs/passport";
import { AuthRolesGuard } from "src/users/role.guard";

@Controller("services")
export class ServiceController {
  constructor(private readonly serviceService: ServiceAppService) {}
  /**
   *@Route POST ~/api/services
   *@description create a new service by the provider or the admin
   * @param createServiceDto
   * @returns success message
   */
  @Post()
  @ApiResponse({ status: 201, description: "Service created successfully" })
  @ApiOperation({ summary: "Create a new service" })
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  create(
    @Body() createServiceDto: CreateServiceDto,
    @CurrentUser()
    user: { id: string; email: string; role: UserRole } | undefined,
  ) {
    if (!user) throw new UnauthorizedException();
    return this.serviceService.create(user.id, user.role, createServiceDto);
  }

  @Get("provider/:providerId")
  @ApiResponse({ status: 200, description: "Get all services" })
  @ApiOperation({ summary: "Get all services" })
  findServicesByProvider(@Param("providerId") providerId: string) {
    return this.serviceService.getServicesByProvider(providerId);
  }

  @Get(":id")
  @ApiResponse({ status: 200, description: "Get service by ID" })
  @ApiOperation({ summary: "Get service by ID" })
  findOne(@Param("id") id: string) {
    return this.serviceService.findOne(id);
  }

  @Put(":id")
  @ApiResponse({ status: 200, description: "Service updated successfully" })
  @ApiOperation({ summary: "Update a service" })
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  update(
    @Param("id") id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @CurrentUser()
    user: { id: string; email: string; role: UserRole } | undefined,
  ) {
    if (!user) throw new UnauthorizedException();
    return this.serviceService.update(id, user.id, user.role, updateServiceDto);
  }

  @Delete(":id")
  @ApiResponse({ status: 200, description: "Service removed successfully" })
  @ApiOperation({ summary: "Remove a service" })
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  remove(
    @Param("id") id: string,
    @CurrentUser()
    user: { id: string; email: string; role: UserRole } | undefined,
  ) {
    if (!user) throw new UnauthorizedException();
    return this.serviceService.remove(id, user.role, user.id);
  }
}
