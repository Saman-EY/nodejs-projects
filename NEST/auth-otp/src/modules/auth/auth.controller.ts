import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CheckOtpDto, SendOtpDto } from "./dto/auth.dto";
import { SignUpDto } from "./dto/basic.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/send")
  sendOtp(@Body() sendOtpdto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpdto);
  }

  @Post("/check")
  checkOtp(@Body() checkOtpdto: CheckOtpDto) {
    return this.authService.checkOtp(checkOtpdto);
  }

  @Post("/signUp")
  signUp(@Body() signUpdto: SignUpDto) {
    return this.authService.signUp(signUpdto);
  }
}
