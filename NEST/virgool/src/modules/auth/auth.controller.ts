import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthDto, checkOtpDto } from "./dto/auth.dto";
import { SwaggerConsumes } from "src/common/enums/swagger.enum";
import type { Request, Response } from "express";
import { CookieKeys } from "src/common/enums/otherEnums.enum";
import { AuthGaurd } from "./guards/auth.guard";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("/user-existence")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  userExistence(@Body() authDto: AuthDto, @Res() res: Response) {
    return this.authService.userExistence(authDto, res);
  }

  @Post("/check-otp")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  checkOtp(@Body() checkOtpDto: checkOtpDto, @Res() res: Response) {
    return this.authService.checkOtp(checkOtpDto.code);
  }

  @Get("/check-login")
  @ApiBearerAuth("Authorization")
  @UseGuards(AuthGaurd)
  checkLogin(@Req() req: Request) {
    return req.user;
  }
}
