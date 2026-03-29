import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { AuthMethod, AuthType } from "./enums";
import { isEmail, isPhoneNumber } from "class-validator";

@Injectable()
export class AuthService {
  userExistence(authDto: AuthDto) {
    const { method, type, username } = authDto;
    switch (type) {
      case AuthType.Login:
        return this.login(method, username);

      default:
        break;
    }
  }

  login(method: AuthMethod, username) {
    return this.validateUsername(method, username);
  }
  register(method: AuthMethod, username) {
    return this.validateUsername(method, username);
  }

  validateUsername(method: AuthMethod, username) {
    switch (method) {
      case AuthMethod.Email:
        if (isEmail(username)) return username;
        throw new BadRequestException("Wrong Username Format! (email)");
      case AuthMethod.Phone:
        if (isPhoneNumber(username, "IR")) return username;
        throw new BadRequestException("Wrong Username Format! (phone)");
      case AuthMethod.Username:
        if (isEmail(username) || isPhoneNumber(username, "IR"))
          throw new BadRequestException("Wrong Username Format! (simple username)");
        return username;

      default:
        throw new BadRequestException("Wrong Username Format!");
    }
  }
}
