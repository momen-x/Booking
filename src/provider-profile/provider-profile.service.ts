import { Injectable } from '@nestjs/common';
import { CreateProviderProfileDto } from './dto/create-provider-profile.dto';
import { UpdateProviderProfileDto } from './dto/update-provider-profile.dto';

@Injectable()
export class ProviderProfileService {
  create(createProviderProfileDto: CreateProviderProfileDto) {
    return 'This action adds a new providerProfile';
  }

  findAll() {
    return `This action returns all providerProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} providerProfile`;
  }

  update(id: number, updateProviderProfileDto: UpdateProviderProfileDto) {
    return `This action updates a #${id} providerProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} providerProfile`;
  }
}
