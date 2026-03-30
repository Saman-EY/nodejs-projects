export enum BadRequestMessage {
  InvalidLoginData = "اطلاعات وارد شده برای ورود صحیح نمیباشد",
  InvalidRegisterData = "اطلاعات وارد شده برای ثبت نام صحیح نمیباشد",
}

export enum AuthMessage {
  NotFoundAccout = "حساب کاربری یافت نشد",
  AlreadyExistAccount = "حساب کاربری با این مشخصات ثبت شده است",
}

export enum PublicMessage {
  SendOtp = "کد otp فرستاده شد",
}
