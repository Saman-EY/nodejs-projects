import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { catchError, lastValueFrom, map } from "rxjs";

import * as queryString from "querystring";
import { SmsTemplate } from "src/common/enums/otherEnums.enum";

@Injectable()
export class KavenegarService {
  constructor(private httpService: HttpService) {}

  async sendVerificationSms(receptor: string, code: string) {
    const { SMS_URL } = process.env;
    const params = queryString.stringify({ receptor, token: code, template: SmsTemplate.Verify });
    const result = await lastValueFrom(
      this.httpService
        .get(`${SMS_URL}?${params}`)
        .pipe(map((res) => res.data))
        .pipe(
          catchError((err) => {
            console.log(err);
            throw new InternalServerErrorException("kavenegar");
          }),
        ),
    );

    console.log(result);

    return result;
  }
}
