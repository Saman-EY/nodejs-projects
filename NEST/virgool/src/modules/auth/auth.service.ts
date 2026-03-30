import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { AuthMethod, AuthType } from "./enums";
import { isEmail, isPhoneNumber } from "class-validator";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { ProfileEntity } from "../user/entities/profile.entity";
import { AuthMessage, BadRequestMessage } from "src/common/enums/messages.enum";
import { OtpEntity } from "../user/entities/otp.entity";
import { randomInt } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
  ) {}

  ///// SIDE SERVICES
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

  async checkExistUser(method: AuthMethod, username: string) {
    let user;
    if (method === AuthMethod.Email) user = await this.userRepository.findOneBy({ email: username });
    else if (method === AuthMethod.Phone) user = await this.userRepository.findOneBy({ phone: username });
    else if (method === AuthMethod.Username) user = await this.userRepository.findOneBy({ username });
    else throw new BadRequestException(BadRequestMessage.InvalidLoginData);
    return user;
  }

  checkOtp() {}
  async saveOtp(userId: number) {
    const code = randomInt(10000, 99999).toString(); // type string
    const expiresIn = new Date(Date.now() + 1000 * 60 * 20);
    let otp = await this.otpRepository.findOneBy({ userId });
    let isExistOtp = false;
    if (otp) {
      isExistOtp = true;
      otp.code = code;
      otp.expiresIn = expiresIn;
    } else {
      otp = this.otpRepository.create({
        code,
        expiresIn,
        userId,
      });
    }

    otp = await this.otpRepository.save(otp);
    if (!isExistOtp) {
      await this.userRepository.update(
        { id: userId },
        {
          otpId: otp.id,
        },
      );
    }

    return otp;
  }

  ///// MAIN SERVICES
  userExistence(authDto: AuthDto) {
    const { method, type, username } = authDto;
    switch (type) {
      case AuthType.Login:
        return this.login(method, username);
      case AuthType.Register:
        return this.register(method, username);

      default:
        throw new UnauthorizedException("bad type format");
    }
  }

  async login(method: AuthMethod, username) {
    const validUsername = this.validateUsername(method, username);
    const user: UserEntity = await this.checkExistUser(method, validUsername);
    if (!user) throw new BadRequestException(AuthMessage.NotFoundAccout);
    const otp = await this.saveOtp(user.id);

    // user.otpId = otp.id;
    // await this.userRepository.save(user);

    return {
      code: otp.code,
    };
  }
  async register(method: AuthMethod, username) {
    const validUsername = this.validateUsername(method, username);
    let user: UserEntity = await this.checkExistUser(method, validUsername);
    if (user) throw new BadRequestException(AuthMessage.AlreadyExistAccount);

    if (method === AuthMethod.Username) throw new BadRequestException(BadRequestMessage.InvalidRegisterData);

    user = await this.userRepository.create({
      [method]: username,
    });
    user = await this.userRepository.save(user);
    user.username = `m_${user.id}`;
    await this.userRepository.save(user);

    const otp = await this.saveOtp(user.id);

    // user.otpId = otp.id;
    // await this.userRepository.save(user);
    return {
      code: otp.code,
    };
  }
}
