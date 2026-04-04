import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { AuthMethod, AuthType } from "./enums";
import { isEmail, isPhoneNumber } from "class-validator";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { ProfileEntity } from "../user/entities/profile.entity";
import { AuthMessage, BadRequestMessage, PublicMessage } from "src/common/enums/messages.enum";
import { OtpEntity } from "../user/entities/otp.entity";
import { randomInt } from "crypto";
import type { Request, Response } from "express";
import { TokenService } from "./tokens.service";
import { CookieKeys } from "src/common/enums/otherEnums.enum";
import { REQUEST } from "@nestjs/core";

@Injectable({ scope: Scope.REQUEST }) // get request
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    private tokenService: TokenService,
    @Inject(REQUEST) private request: Request,
  ) {}

  ///// SIDE SERVICES

  async sendResponse(result, res: Response) {
    const { token, code } = result;
    res.cookie(CookieKeys.Otp, token, { httpOnly: true, expires: new Date(Date.now() + 1000 * 60 * 20) });
    res.json({
      message: PublicMessage.SendOtp,
      code,
    });
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

  async validateAccessToken(token: string) {
    const { userId } = this.tokenService.verifyAccessToken(token);
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException(AuthMessage.TryLogin);
    return user;
  }

  async checkExistUser(method: AuthMethod, username: string) {
    let user: UserEntity | null;
    if (method === AuthMethod.Email) user = await this.userRepository.findOneBy({ email: username });
    else if (method === AuthMethod.Phone) user = await this.userRepository.findOneBy({ phone: username });
    else if (method === AuthMethod.Username) user = await this.userRepository.findOneBy({ username });
    else throw new BadRequestException(BadRequestMessage.InvalidLoginData);

    return user;
  }

  async checkOtp(code: string) {
    const token = this.request.cookies?.[CookieKeys.Otp];
    if (!token) throw new UnauthorizedException(AuthMessage.ExpiredToken);
    const { userId } = this.tokenService.verifyOtpToken(token);
    const otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) throw new UnauthorizedException(AuthMessage.TryLogin);
    const now = new Date(); // or Date.now()
    if (otp.expiresIn < now) throw new UnauthorizedException(AuthMessage.ExpiredCode);
    if (otp.code !== code) throw new UnauthorizedException(AuthMessage.TryLogin);

    const accessToken = this.tokenService.createAccessToken({ userId });

    await this.otpRepository.delete(otp.id);

    if (otp.method === AuthMethod.Email) {
      await this.userRepository.update(
        { id: userId },
        {
          verified_email: true,
        },
      );
    } else if (otp.method === AuthMethod.Phone) {
      await this.userRepository.update(
        { id: userId },
        {
          verified_phone: true,
        },
      );
    }

    return {
      accessToken,
      message: PublicMessage.loginDone,
    };
  }

  async saveOtp(userId: number, method: string) {
    const code = randomInt(10000, 99999).toString(); // type string
    const expiresIn = new Date(Date.now() + 1000 * 60 * 2);
    const now = new Date();
    let otp = await this.otpRepository.findOneBy({ userId });
    let isExistOtp = false;
    if (otp) {
      if (otp.expiresIn > now) throw new BadRequestException("کد قبلی هنوز منقضی نشده است!");
      isExistOtp = true;
      otp.code = code;
      otp.expiresIn = expiresIn;
      otp.method = method;
    } else {
      otp = this.otpRepository.create({
        code,
        expiresIn,
        userId,
        method,
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
  async userExistence(authDto: AuthDto, res: Response) {
    const { method, type, username } = authDto;
    switch (type) {
      case AuthType.Login: {
        const result = await this.login(method, username);
        return this.sendResponse(result, res);
      }
      case AuthType.Register: {
        const result = await this.register(method, username);

        return this.sendResponse(result, res);
      }

      default: {
        throw new UnauthorizedException("bad type format");
      }
    }
  }

  async login(method: AuthMethod, username) {
    const validUsername = this.validateUsername(method, username);
    const user: UserEntity | null = await this.checkExistUser(method, validUsername);
    if (!user) throw new BadRequestException(AuthMessage.NotFoundAccout);
    const otp = await this.saveOtp(user.id, method);

    const token = this.tokenService.createOtpToken({ userId: user.id });

    // user.otpId = otp.id;
    // await this.userRepository.save(user);

    return {
      message: PublicMessage.SendOtp,
      token,
      code: otp.code,
    };
  }

  async register(method: AuthMethod, username) {
    const validUsername = this.validateUsername(method, username);
    let user: UserEntity | null = await this.checkExistUser(method, validUsername);

    if (user) throw new ConflictException(AuthMessage.AlreadyExistAccount);

    // if (method === AuthMethod.Username) throw new BadRequestException(BadRequestMessage.InvalidRegisterData); // for handling username auto by id
    user = this.userRepository.create({
      [method]: username,
    });
    user = await this.userRepository.save(user);
    if (method !== AuthMethod.Username) {
      user.username = `m_${user.id}`;
    }
    await this.userRepository.save(user);

    const otp = await this.saveOtp(user.id, method);

    const token = this.tokenService.createOtpToken({ userId: user.id });

    // user.otpId = otp.id;
    // await this.userRepository.save(user);
    return { message: PublicMessage.SendOtp, token, code: otp.code };
  }
}
