import { Body, Controller, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { SupplierService } from "./supplier.service";
import { SupplementaryInfoDto, SupplierDto, UploadDocsDto } from "./dto/supplier.dto";
import { CheckOtpDto } from "../auth/dto/auth.dto";
import { SupplierAuthGuard } from "src/common/decorators/auth.decorator";
import { UploadFileFieldsS3 } from "src/common/interceptors/upload.interceptor";
import { ApiConsumes } from "@nestjs/swagger";
import { FormTypes } from "src/common/enums";

@Controller("supplier")
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post("/signup")
  signup(@Body() supplierDto: SupplierDto) {
    return this.supplierService.signup(supplierDto);
  }

  @Post("/check-otp")
  checkOtp(@Body() checOtpDto: CheckOtpDto) {
    return this.supplierService.checkOtp(checOtpDto);
  }

  @Post("/supplementary-information")
  @SupplierAuthGuard()
  saveSupplementaryInfo(@Body() infoDto: SupplementaryInfoDto) {
    return this.supplierService.saveSupplementaryInfo(infoDto);
  }

  @Put("/upload-documents")
  @ApiConsumes(FormTypes.Multipart)
  @UseInterceptors(
    UploadFileFieldsS3([
      { name: "acceptedDoc", maxCount: 1 },
      { name: "image", maxCount: 1 },
    ]),
  )
  @SupplierAuthGuard()
  uploadDocs(@Body() uploadedDocs: UploadDocsDto, @UploadedFiles() files: any) {
    return this.supplierService.uploadDocuments(files);
  }
}
