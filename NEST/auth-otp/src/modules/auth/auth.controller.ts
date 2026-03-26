import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/send")
  sendOtp() {
    return this.authService
  }
  @Post("/check")
  checkOtp() {
    return this.authService
  }
}
