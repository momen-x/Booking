import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import express from "express";
import { RegisterUserDto } from "./dto/register-auth.dto";
import { LoginUserDto } from "./dto/login-auth.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiResponse({ status: 201, description: "User registered successfully" })
  @ApiOperation({ summary: "Register a new user" })
  async create(
    @Body() dto: RegisterUserDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.register(dto);
    if (result.access_token) {
      res.cookie("access_token", result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    }
    return { success: true };
  }
  @HttpCode(HttpStatus.OK)
  @Post("login")
  @ApiResponse({ status: 200, description: "login user" })
  @ApiOperation({ summary: "login user" })
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.login(dto);
    if (result.access_token) {
      res.cookie("access_token", result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    }
    return { success: true };
  }
}
