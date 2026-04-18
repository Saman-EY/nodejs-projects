import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { isJWT } from "class-validator";
import { Request } from "express";
import { SupplierService } from "../supplier.service";

@Injectable()
export class SupplierGuard implements CanActivate {
  constructor(private supplierService: SupplierService) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    request.user = await this.supplierService.validateToken(token);
    return true;
  }

  protected extractToken(request: Request) {
    const { authorization } = request.headers;
    if (!authorization || authorization.trim() == "") {
      throw new UnauthorizedException("Login To Your Account!");
    }
    const [bearer, token] = authorization.split(" ");
    if (bearer.toLowerCase() !== "bearer" || !token || !isJWT(token)) {
      throw new UnauthorizedException("Login To Your Account!");
    }

    return token;
  }
}
