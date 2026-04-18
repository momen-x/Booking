import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CURRENT_USER_KEY } from "../../Utils/constants";
import { JWTPayloadType } from "../../../utils/types";

// CurrentUser Parameter Decorator
export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Record<string, any>>();
    return (
      (request.user as JWTPayloadType | undefined) ??
      (request[CURRENT_USER_KEY] as JWTPayloadType | undefined)
    );
  },
);
