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
import { MulterDestination, MulterFilename, multerStorage } from "src/common/utils/multer.util";
import type { TProfileImages } from "src/common/types/types";
import { UploadOptionalFiles } from "src/common/decorators/uploadFile.decorator";

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
}
