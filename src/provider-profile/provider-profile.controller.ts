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
import { ProviderProfileService } from "./provider-profile.service";
import { UpdateProviderProfileDto } from "./dto/update-provider-profile.dto";
import { UserRole } from "@prisma/client";
import { Roles } from "src/users/decorator/user-role.decorator";
import { AuthRolesGuard } from "src/users/role.guard";
import { AuthGuard } from "@nestjs/passport";
import { AuthenticatedUser } from "src/users/decorator/authenticated-user.decorator";
import { CreateProviderProfileDto } from "./dto/create-provider-profile.dto";

@Controller("provider-profile")
export class ProviderProfileController {
  constructor(
    private readonly providerProfileService: ProviderProfileService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN) // Only admin can create products
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  create(
    @Body()
    createProviderProfileDto: CreateProviderProfileDto,
  ) {
    return this.providerProfileService.create(createProviderProfileDto);
  }

  @Get()
  findAll() {
    return this.providerProfileService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.providerProfileService.findOne(id);
  }

  @Put(":id")
  @Roles(UserRole.PROVIDER, UserRole.ADMIN)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  update(
    @Param("id") id: string,
    @Body() updateProviderProfileDto: UpdateProviderProfileDto,
    @AuthenticatedUser()
    user: { id: string; email: string; role: UserRole },
  ) {
    return this.providerProfileService.update(
      id,
      user.id,
      user.role,
      updateProviderProfileDto,
    );
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard("jwt"), AuthRolesGuard)
  remove(
    @Param("id") id: string,
    @AuthenticatedUser()
    user: { id: string; email: string; role: UserRole },
  ) {
    return this.providerProfileService.remove(user.id, user.role, id);
  }
}
