import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from "@nestjs/common";
import { ServiceAppService } from "./service.service";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { AuthenticatedUser } from "src/users/decorator/authenticated-user.decorator";
import { UserRole } from "@prisma/client";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { Roles } from "src/users/decorator/user-role.decorator";
import { AuthGuard } from "@nestjs/passport";
import { AuthRolesGuard } from "src/users/role.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ServicesImagesUploadDto } from "./dto/upload-service-images.dto";

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
    @AuthenticatedUser()
    user: { id: string; email: string; role: UserRole },
  ) {
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
    @AuthenticatedUser()
    user: { id: string; email: string; role: UserRole },
  ) {
    return this.serviceService.update(id, user.id, user.role, updateServiceDto);
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
  @Post(":id/images")
  @UseInterceptors(FilesInterceptor("service-images", 3))
  @ApiResponse({ status: 201, description: "Images uploaded successfully" })
  @ApiOperation({ summary: "Upload service images" })
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: ServicesImagesUploadDto, description: "service images" })
  uploadImages(
    @Param("id") serviceId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @AuthenticatedUser() user: { id: string; role: UserRole },
  ) {
    if (!files || files.length === 0)
      throw new BadRequestException("No files uploaded");
    return this.serviceService.uploadServiceImages(
      serviceId,
      user.id,
      user.role,
      files,
    );
  }

  // service.controller.ts

  @Delete(":id/images")
  @ApiOperation({ summary: "Delete a service image" })
  @ApiResponse({ status: 200, description: "Image deleted successfully" })
  @ApiBody({ schema: { properties: { imageUrl: { type: "string" } } } })
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  removeImage(
    @Param("id") serviceId: string,
    @Body("imageUrl") imageUrl: string,
    @AuthenticatedUser() user: { id: string; role: UserRole },
  ) {
    if (!imageUrl) throw new BadRequestException("imageUrl is required");
    return this.serviceService.removeServiceImage(
      serviceId,
      imageUrl,
      user.id,
      user.role,
    );
  }

  @Put(":id/images")
  @UseInterceptors(FilesInterceptor("service-image", 1))
  @ApiOperation({ summary: "Replace a service image" })
  @ApiResponse({ status: 200, description: "Image replaced successfully" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
        oldImageUrl: { type: "string" },
      },
    },
  })
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  replaceImage(
    @Param("id") serviceId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body("oldImageUrl") oldImageUrl: string,
    @AuthenticatedUser() user: { id: string; role: UserRole },
  ) {
    if (!files || files.length === 0)
      throw new BadRequestException("No file uploaded");
    if (!oldImageUrl) throw new BadRequestException("oldImageUrl is required");
    return this.serviceService.updateServiceImage(
      serviceId,
      oldImageUrl,
      files[0],
      user.id,
      user.role,
    );
  }
}
