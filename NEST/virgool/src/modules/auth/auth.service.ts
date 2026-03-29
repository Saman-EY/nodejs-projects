import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { AuthMethod, AuthType } from "./enums";
import { isEmail, isPhoneNumber } from "class-validator";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { ProfileEntity } from "../user/entities/profile.entity";
import { AuthMessage, BadRequestMessage } from "src/common/enums/messages.enum";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
  ) {}

  // SIDE SERVICES
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

  // MAIN SERVICES
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
  }
  async register(method: AuthMethod, username) {
    const validUsername = this.validateUsername(method, username);
    const user = await this.checkExistUser(method, validUsername);
    if (user) throw new BadRequestException(AuthMessage.AlreadyExistAccount);
  }
}
