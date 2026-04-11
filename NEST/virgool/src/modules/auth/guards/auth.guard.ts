import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { isJWT } from "class-validator";
import { Request } from "express";
import { Observable } from "rxjs";
import { AuthMessage } from "src/common/enums/messages.enum";
import { AuthService } from "../auth.service";
import { Reflector } from "@nestjs/core";
import { SKIP_AUTH } from "src/common/decorators/skip-auth.decorator";
import { UserStatus } from "src/common/enums/otherEnums.enum";

@Injectable()
export class AuthGaurd implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isSkippedAuthorization = this.reflector.get<boolean>(SKIP_AUTH, context.getHandler());
    if (isSkippedAuthorization) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractToken(request);
    request.user = await this.authService.validateAccessToken(token);

    if (request?.user?.status === UserStatus.Ban) {
      throw new ForbiddenException(AuthMessage.Banned);
    }

    return true;
  }

  protected extractToken(request: Request): string {
    const { authorization } = request.headers;

    if (!authorization || authorization.trim() == "") throw new UnauthorizedException(AuthMessage.LoginRequired);

    const [bearer, token] = authorization.split(" ");
    if (bearer.toLowerCase() !== "bearer" || !token || !isJWT(token))
      throw new UnauthorizedException(AuthMessage.LoginRequired);

    return token;
  }
}
