import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ServiceAppService } from "./service.service";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { AuthenticatedUser } from "src/users/decorator/authenticated-user.decorator";
import { UserRole } from "@prisma/client";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Roles } from "src/users/decorator/user-role.decorator";
import { AuthGuard } from "@nestjs/passport";
import { AuthRolesGuard } from "src/users/role.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import multer from "multer";

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
  @UseInterceptors(
    FilesInterceptor("images", 3, {
      storage: multer.memoryStorage(),
    }),
  )
  create(
    @Body() createServiceDto: CreateServiceDto,
    @AuthenticatedUser()
    user: { id: string; email: string; role: UserRole },
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.serviceService.create(
      user.id,
      user.role,
      createServiceDto,
      files,
    );
  }
  @Get()
  @ApiResponse({ status: 200, description: "Get all services" })
  @ApiOperation({ summary: "Get all services" })
  findAll() {
    return this.serviceService.findAll();
  }

  @Get("provider/:providerId")
  @ApiResponse({ status: 200, description: "Get all provider's services" })
  @ApiOperation({ summary: "Get all provider's services" })
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
  @UseInterceptors(FilesInterceptor("newImages", 3))
  update(
    @Param("id") id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @AuthenticatedUser()
    user: { id: string; email: string; role: UserRole },
    @UploadedFiles() newFiles: Express.Multer.File[],
  ) {
    return this.serviceService.update(
      id,
      user.id,
      user.role,
      updateServiceDto,
      newFiles,
    );
  }

  @Delete(":id")
  @ApiResponse({ status: 200, description: "Service removed successfully" })
  @ApiOperation({ summary: "Remove a service" })
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  remove(
    @Param("id") id: string,
    @AuthenticatedUser()
    user: { id: string; email: string; role: UserRole },
  ) {
    return this.serviceService.remove(id, user.role, user.id);
  }
}
