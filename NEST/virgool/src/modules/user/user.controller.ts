import {
  Controller,
  Get,
  Body,
  Patch,
  Put,
  UseGuards,
  UseInterceptors,
  Res,
  Post,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from "@nestjs/swagger";
import { ChangeEmailDto, ChangePhoneDto, ProfileDto } from "./dto/profile.dto";
import { SwaggerConsumes } from "src/common/enums/swagger.enum";
import { AuthGaurd } from "../auth/guards/auth.guard";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { multerStorage } from "src/common/utils/multer.util";
import type { TProfileImages } from "src/common/types/types";
import { UploadOptionalFiles } from "src/common/decorators/uploadFile.decorator";
import type { Response } from "express";
import { CookieKeys, Roles } from "src/common/enums/otherEnums.enum";
import { checkOtpDto } from "../auth/dto/auth.dto";
import { ChangeUsernameDto } from "./dto/update-user.dto";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { CanAccess } from "src/common/decorators/role.decorator";

@Controller("user")
@ApiTags("User")
// @ApiBearerAuth("Authorization")
// @UseGuards(AuthGaurd)
@AuthDecorator() // includes auth guard and role guard
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/all-users")
  @CanAccess(Roles.Admin) // only admin
  find() {
    return this.userService.findAll();
  }

  @Get("/profile")
  profile() {
    return this.userService.profile();
  }

  @Get("/follow/:userId")
  @ApiParam({ name: "userId" })
  follow(@Param("userId", ParseIntPipe) userId: number) {
    return this.userService.followToggle(userId);
  }

  @Put("/profile")
  @ApiConsumes(SwaggerConsumes.MultiPartData)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "image_profile", maxCount: 1 },
        { name: "bg_image", maxCount: 1 },
      ],
      {
        storage: multerStorage("user-profile"),
      },
    ),
  )
  changeProfile(
    @UploadOptionalFiles() files: TProfileImages,
    @Body()
    profileDto: ProfileDto,
  ) {
    return this.userService.changeProfile(files, profileDto);
  }

  @Patch("/change-username")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changeUsername(@Body() usernameDto: ChangeUsernameDto) {
    return this.userService.changeUsername(usernameDto.username);
  }

  @Patch("/change-email")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changeEmail(@Body() emailDto: ChangeEmailDto, @Res() res: Response) {
    const { code, message, token } = await this.userService.changeEmail(emailDto.email);
    if (message) return res.json({ message });
    res.cookie(CookieKeys.EmailOtp, token, { httpOnly: true, expires: new Date(Date.now() + 1000 * 60 * 2) });
    res.json({
      code,
      message,
    });
  }
  @Patch("/change-phone")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changePhone(@Body() phoneDto: ChangePhoneDto, @Res() res: Response) {
    const { code, message, token } = await this.userService.changePhone(phoneDto.phone);
    if (message) return res.json({ message });
    res.cookie(CookieKeys.PhoneOtp, token, { httpOnly: true, expires: new Date(Date.now() + 1000 * 60 * 2) });
    res.json({
      code,
      message,
    });
  }

  @Post("/verify-email")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  verifyEmail(@Body() otpDto: checkOtpDto) {
    return this.userService.verifyEmail(otpDto.code);
  }

  @Post("/verify-phone")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  verifyPhone(@Body() otpDto: checkOtpDto) {
    return this.userService.verifyPhone(otpDto.code);
  }
}
