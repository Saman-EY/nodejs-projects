import { Controller, Get, Body, Patch, Put, UseGuards, UseInterceptors, Res } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ChangeEmailDto, ProfileDto } from "./dto/profile.dto";
import { SwaggerConsumes } from "src/common/enums/swagger.enum";
import { AuthGaurd } from "../auth/guards/auth.guard";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { multerStorage } from "src/common/utils/multer.util";
import type { TProfileImages } from "src/common/types/types";
import { UploadOptionalFiles } from "src/common/decorators/uploadFile.decorator";
import type { Response } from "express";
import { CookieKeys } from "src/common/enums/otherEnums.enum";

@Controller("user")
@ApiTags("User")
@UseGuards(AuthGaurd)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put("/profile")
  @ApiConsumes(SwaggerConsumes.MultiPartData)
  @ApiBearerAuth("Authorization")
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

  @ApiBearerAuth("Authorization")
  @Get("/profile")
  profile() {
    return this.userService.profile();
  }

  @Patch("/change-email")
  async changeEmail(@Body() emailDto: ChangeEmailDto, @Res() res: Response) {
    const { code, message, token } = await this.userService.changeEmail(emailDto.email);
    if (message) return res.json({ message });
    res.cookie(CookieKeys.EmailOtp, token, { httpOnly: true, expires: new Date(Date.now() + 1000 * 60 * 2) });
    res.json({
      code,
      message,
    });
  }
}
