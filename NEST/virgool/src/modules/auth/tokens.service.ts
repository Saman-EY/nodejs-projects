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
  createAccessToken(payload: { userId: number }) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: "1y",
    });

    return token;
  }

  verifyAccessToken(token: string): { userId: number } {
    try {
      return this.jwtService.verify(token, { secret: process.env.ACCESS_TOKEN_SECRET });
    } catch (error) {
      throw new UnauthorizedException(AuthMessage.TryLogin);
    }
  }

  createEmailToken(payload: { email: string }) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.EMAIL_TOKEN_SECRET,
      expiresIn: 60 * 2,
    });

    return token;
  }

  verifyEmailToken(token: string): { email: string } {
    try {
      return this.jwtService.verify(token, { secret: process.env.EMAIL_TOKEN_SECRET });
    } catch (error) {
      throw new UnauthorizedException(AuthMessage.SomethingWrong);
    }
  }

  createPhoneToken(payload: { phone: string }) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.PHONE_TOKEN_SECRET,
      expiresIn: 60 * 2,
    });

    return token;
  }

  verifyPhoneToken(token: string): { phone: string } {
    try {
      return this.jwtService.verify(token, { secret: process.env.PHONE_TOKEN_SECRET });
    } catch (error) {
      throw new UnauthorizedException(AuthMessage.SomethingWrong);
    }
  }
}
