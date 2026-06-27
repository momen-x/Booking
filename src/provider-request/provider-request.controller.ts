import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Put,
} from "@nestjs/common";
import { ProviderRequestService } from "./provider-request.service";
import { CreateProviderRequestDto } from "./dto/create-provider-request.dto";
import { Roles } from "src/users/decorator/user-role.decorator";
import { UserRole } from "@prisma/client";
import { AuthGuard } from "@nestjs/passport";
import { AuthRolesGuard } from "src/users/role.guard";
import { AuthenticatedUser } from "src/users/decorator/authenticated-user.decorator";
import { ApiBody, ApiConsumes, ApiResponse } from "@nestjs/swagger";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { UpdateProviderRequestDto } from "./dto/update-provider-request.dto";

@Controller("provider-request")
export class ProviderRequestController {
  constructor(
    private readonly providerRequestService: ProviderRequestService,
  ) {}

  @Post()
  @Roles(UserRole.USER)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "IDImage", maxCount: 1 },
      { name: "selfieIDImage", maxCount: 1 },
      { name: "Portfolio", maxCount: 5 },
    ]),
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        provideName: { type: "string" },
        IDNumber: { type: "string" },
        fullName: { type: "string" },
        birthday: { type: "string", format: "date" },
        nationality: { type: "string" },
        location: { type: "string" },
        IDImage: { type: "string", format: "binary" },
        selfieIDImage: { type: "string", format: "binary" },
        Portfolio: {
          type: "array",
          items: { type: "string", format: "binary" },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Create new provider request",
  })
  async create(
    @Body() createProviderRequestDto: CreateProviderRequestDto,
    @UploadedFiles()
    files: {
      IDImage?: Express.Multer.File[];
      selfieIDImage?: Express.Multer.File[];
      Portfolio?: Express.Multer.File[];
    },
    @AuthenticatedUser() user: { id: string; role: UserRole },
  ) {
    if (user.role !== UserRole.USER)
      throw new BadRequestException("bad request");
    return this.providerRequestService.create(
      user.id,
      createProviderRequestDto,
      files,
    );
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  @ApiResponse({
    status: 200,
    description: "Get all provider requests",
  })
  findAll() {
    return this.providerRequestService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  @ApiResponse({
    status: 200,
    description: "Get single provider request",
  })
  findOne(@Param("id") id: string) {
    return this.providerRequestService.findOne(id);
  }
  @Get("current-user")
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  @ApiResponse({
    status: 200,
    description: "Get user's provider request",
  })
  findCurrentUserProviderRequest(
    @AuthenticatedUser() user: { id: string; role: UserRole },
  ) {
    return this.providerRequestService.findByUserId(user.id);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  @ApiResponse({
    status: 200,
    description: "Delete provider request",
  })
  remove(@Param("id") id: string) {
    return this.providerRequestService.remove(id);
  }
  @Put(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  @ApiResponse({
    status: 200,
    description: "Update provider request status",
  })
  updateStatus(
    @Param("id") id: string,
    @Body() body: UpdateProviderRequestDto,
  ) {
    return this.providerRequestService.updateStatus(id, body);
  }
}
