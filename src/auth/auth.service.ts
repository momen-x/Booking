import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-auth.dto";
import { LoginUserDto } from "./dto/login-auth.dto";
import * as bcrypt from "bcryptjs";
import { JWTPayloadType } from "utils/types";
import { UserRole } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "./user.repository";

@Injectable()
export class AuthService {
  constructor(
    private authRepo: UserRepository,
    private jwtService: JwtService,
  ) {}
  async register(dto: RegisterUserDto): Promise<{ access_token: string }> {
    const isExistUser = await this.authRepo.findByEmail(dto.email);
    if (isExistUser)
      throw new BadRequestException("User with this email already exists");
    const hashPassword = await bcrypt.hash(dto.password, 12);
    const newUser = await this.authRepo.create({
      email: dto.email,
      password: hashPassword,
      username: dto.username,
    });

    const { access_token } = this.createToken(
      newUser.id,
      newUser.email,
      newUser.role,
    );

    return { access_token };
  }
  async login(loginUser: LoginUserDto): Promise<{ access_token: string }> {
    const isExistUser = await this.authRepo.findByEmail(loginUser.email);
    if (!isExistUser) throw new BadRequestException("Invalid credentials");
    const isPasswordMatch = await bcrypt.compare(
      loginUser.password,
      isExistUser.password,
    );

    if (!isPasswordMatch)
      throw new UnauthorizedException("Invalid credentials");
    const { access_token } = this.createToken(
      isExistUser.id,
      isExistUser.email,
      isExistUser.role,
    );
    return { access_token };
  }
  private createToken(id: string, email: string, role: UserRole) {
    const payload: JWTPayloadType = {
      sub: id,
      email: email,
      role: role,
    };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
