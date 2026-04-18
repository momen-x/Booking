//role.guard.ts file
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { UserRole } from "@prisma/client";
import { ExtractJwt } from "passport-jwt";
import { JWTPayloadType } from "utils/types";

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: UserRole[] = this.reflector.getAllAndOverride("roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) return true;

    const request: Request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const token: string | undefined =
      (request.cookies as Record<string, string> | undefined)?.[
        "access_token"
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      ] || ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if (!token) throw new UnauthorizedException("No token found");

    try {
      const payload: JWTPayloadType = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return roles.includes(payload.role);
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
