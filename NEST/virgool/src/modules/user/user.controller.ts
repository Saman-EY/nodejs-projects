import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ProfileDto } from "./dto/profile.dto";
import { SwaggerConsumes } from "src/common/enums/swagger.enum";
import { AuthGaurd } from "../auth/guards/auth.guard";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { MulterDestination, MulterFilename } from "src/common/utils/multer.util";

@Controller("user")
@ApiTags("User")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put("/profile")
  @ApiConsumes(SwaggerConsumes.MultiPartData)
  @ApiBearerAuth("Authorization")
  @UseGuards(AuthGaurd)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "image_profile", maxCount: 1 },
        { name: "bg_image", maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: MulterDestination("user-profile"),
          filename: MulterFilename,
        }),
      },
    ),
  )
  changeProfile(
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [],
      }),
    ) files,
    @Body()
    profileDto: ProfileDto,
  ) {
    return this.userService.changeProfile(files,profileDto);
  }
}
