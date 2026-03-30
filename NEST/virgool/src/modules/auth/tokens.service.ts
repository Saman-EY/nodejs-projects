import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthMessage } from "src/common/enums/messages.enum";

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  createOtpToken(payload: { userId: number }) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.OTP_TOKEN_SECRET,
      expiresIn: 60 * 2,
    });

    return token;
  }

  verifyOtpToken(token: string): { userId: number } {
    try {
      return this.jwtService.verify(token, { secret: process.env.OTP_TOKEN_SECRET });
    } catch (error) {
      throw new UnauthorizedException(AuthMessage.TryLogin);
    }
  }
}
