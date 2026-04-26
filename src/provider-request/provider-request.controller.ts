import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ProviderRequestService } from "./provider-request.service";
import { CreateProviderRequestDto } from "./dto/create-provider-request.dto";
import { Roles } from "src/users/decorator/user-role.decorator";
import { UserRole } from "@prisma/client";
import { AuthGuard } from "@nestjs/passport";
import { AuthRolesGuard } from "src/users/role.guard";
import { AuthenticatedUser } from "src/users/decorator/authenticated-user.decorator";

@Controller("provider-request")
export class ProviderRequestController {
  constructor(
    private readonly providerRequestService: ProviderRequestService,
  ) {}

  @Post()
  @Roles(UserRole.USER)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  create(
    @Body() createProviderRequestDto: CreateProviderRequestDto,
    @AuthenticatedUser() user: { id: string; role: UserRole },
  ) {
    return this.providerRequestService.create(
      user.id,
      createProviderRequestDto,
    );
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  findAll() {
    return this.providerRequestService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  findOne(@Param("id") id: string) {
    return this.providerRequestService.findOne(id);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  remove(@Param("id") id: string) {
    return this.providerRequestService.remove(id);
  }
}
