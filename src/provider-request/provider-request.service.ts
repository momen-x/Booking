import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProviderRequestDto } from "./dto/create-provider-request.dto";
import { ProviderRequestRepository } from "./provider-request.repository";
import { UserRepository } from "src/users/user.repository";

@Injectable()
export class ProviderRequestService {
  constructor(
    private readonly providerRequestRepo: ProviderRequestRepository,
    private readonly userRepo: UserRepository,
  ) {}
  async create(
    userId: string,
    createProviderRequestDto: CreateProviderRequestDto,
  ) {
    const user = await this.checkIfUserExist(userId);
    return this.providerRequestRepo.create(user.id, createProviderRequestDto);
  }

  findAll() {
    return this.providerRequestRepo.findAll();
  }

  async findOne(id: string) {
    const request = await this.checkIfRequestExist(id);
    return request;
  }

  async remove(id: string) {
    const request = await this.checkIfRequestExist(id);
    return this.providerRequestRepo.delete(request.id);
  }
  async checkIfUserExist(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException("user not found");
    }
    return user;
  }
  async checkIfRequestExist(id: string) {
    const request = await this.providerRequestRepo.findById(id);
    if (!request) {
      throw new NotFoundException("request not found");
    }
    return request;
  }
}
