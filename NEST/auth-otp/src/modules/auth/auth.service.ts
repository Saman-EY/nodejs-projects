import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { OtpEntity } from "../user/entities/otp.entity";
import { CheckOtpDto, SendOtpDto } from "./dto/auth.dto";
import { randomInt } from "crypto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { LoginDto, SignUpDto } from "./dto/basic.dto";
import { compareSync, genSaltSync, hashSync } from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // METHODS
  async createOtpForUser(user: UserEntity) {
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2); // 2 min
    const code = randomInt(10000, 99999);

    let otp = await this.otpRepository.findOneBy({ userId: user.id });
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException("code is not expired yet");
      }
      otp.code = code;
      otp.expires_in = expiresIn;
    } else {
      otp = this.otpRepository.create({ code, expires_in: expiresIn, userId: user.id });
    }

    otp = await this.otpRepository.save(otp);
    user.otpId = otp.id;
    user = await this.userRepository.save(user);
    return code;
  }

  createTokens(payload: { mobile: string; id: number }) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get("Jwt.accessTokenSecret"),
      expiresIn: "30d",
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get("Jwt.refreshTokenSecret"),
      expiresIn: "1y",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify<{ mobile: string; id: number }>(token, {
        secret: this.configService.get("Jwt.accessTokenSecret"),
      });

      if (typeof payload === "object" && payload?.id) {
        const user = await this.userRepository.findOneBy({ id: payload.id });
        if (!user) throw new UnauthorizedException("Login To Your Account!");
        return user;
      }

      throw new UnauthorizedException("Login To Your Account!");
    } catch (error) {
      throw new UnauthorizedException("Login To Your Account!");
    }
  }

  async checkExistEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) throw new ConflictException("Email Already Exist!");
  }
  async checkExistMobile(mobile: string) {
    const user = await this.userRepository.findOneBy({ mobile });
    if (user) throw new ConflictException("Mobile Number Already Exist!");
  }

  // MAIN SERVICES

  async sendOtp(otpDto: SendOtpDto) {
    const { mobile } = otpDto;
    let user = await this.userRepository.findOne({ where: { mobile } });
    if (!user) {
      user = this.userRepository.create({ mobile });
      user = await this.userRepository.save(user);
    }
    const code = await this.createOtpForUser(user);
    return {
      code,
      message: "Code Send Successfuly",
    };
  }

  async checkOtp(otpDto: CheckOtpDto) {
    const { mobile, code } = otpDto;

    const now = new Date();
    let user = await this.userRepository.findOne({
      where: { mobile },
      relations: {
        otp: true,
      },
    });
    // validattion
    if (!user || !user.otp) throw new UnauthorizedException("Account Not Found!");
    if (user?.otp?.code !== code) throw new UnauthorizedException("Otp Code Is Incorrect");
    if (user?.otp?.expires_in < now) throw new UnauthorizedException("Otp Code Has Expired");

    if (user?.mobileVerified) await this.userRepository.update({ id: user.id }, { mobileVerified: true });
    const payload = { mobile, id: user?.id };

    const { accessToken, refreshToken } = this.createTokens(payload);

    return {
      accessToken,
      refreshToken,
      message: "Login Success",
    };
  }

  async signUp(signupDto: SignUpDto) {
    const { confirmPassword, email, first_name, last_name, mobile, password } = signupDto;

    await this.checkExistEmail(email);
    await this.checkExistMobile(mobile);

    // if (confirmPassword !== password) {
    //   throw new BadRequestException("password and confirm password word do not match!");
    // }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    const user = await this.userRepository.create({
      email,
      first_name,
      last_name,
      mobile,
      mobileVerified: false,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return {
      message: "user created successfuly!",
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new UnauthorizedException("email/password Is Incorrect!");

    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException("email/password Is Incorrect!");
    }

    const { accessToken, refreshToken } = this.createTokens({ mobile: user.mobile, id: user.id });

    return {
      accessToken,
      refreshToken,
      message: "user created successfuly!",
    };
  }
}
