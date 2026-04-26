import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { JWTPayloadType } from "utils/types";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const secret = configService.get<string>("JWT_SECRET");
    if (!secret) throw new Error("JWT_SECRET is not defined in environment");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      passReqToCallback: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          if (!req) return null;
          const cookieToken = (req.cookies as
            | Record<string, string>
            | undefined)
            ? (req.cookies["access_token"] as string | undefined)
            : undefined;
          if (cookieToken) return cookieToken;

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          const authHeaderToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          if (authHeaderToken) return authHeaderToken;

          const rawCookie = req.headers?.cookie;
          if (typeof rawCookie === "string") {
            const parsed = Object.fromEntries(
              rawCookie.split(";").map((cookie) => {
                const [key, ...val] = cookie.split("=");
                return [key.trim(), decodeURIComponent(val.join("="))];
              }),
            );
            if (parsed["access_token"]) return parsed["access_token"];
          }

          const query = req.query as Record<string, unknown> | undefined;
          if (query) {
            const queryToken = query["access_token"] || query["token"];
            if (typeof queryToken === "string") return queryToken;
          }

          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(req: Request, payload: JWTPayloadType) {
    const user = await this.prisma.user.findUnique({
      where: { id: String(payload.sub) },
      select: { id: true, email: true, role: true }, // Include role
    });

    if (!user) throw new UnauthorizedException("User no longer exists");
    return user;
  }
}
