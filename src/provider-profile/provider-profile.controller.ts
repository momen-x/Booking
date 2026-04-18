import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProviderProfileService } from './provider-profile.service';
import { CreateProviderProfileDto } from './dto/create-provider-profile.dto';
import { UpdateProviderProfileDto } from './dto/update-provider-profile.dto';

@Controller('provider-profile')
export class ProviderProfileController {
  constructor(private readonly providerProfileService: ProviderProfileService) {}

  @Post()
  create(@Body() createProviderProfileDto: CreateProviderProfileDto) {
    return this.providerProfileService.create(createProviderProfileDto);
  }

  @Get()
  findAll() {
    return this.providerProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.providerProfileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProviderProfileDto: UpdateProviderProfileDto) {
    return this.providerProfileService.update(+id, updateProviderProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.providerProfileService.remove(+id);
  }
}
