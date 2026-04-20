import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { CURRENT_USER_KEY } from "../../Utils/constants";
import { JWTPayloadType } from "../../../utils/types";

// AuthenticatedUser Parameter Decorator - throws UnauthorizedException if user is not found
export const AuthenticatedUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Record<string, any>>();
    const user =
      (request.user as JWTPayloadType | undefined) ??
      (request[CURRENT_USER_KEY] as JWTPayloadType | undefined);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  },
);
