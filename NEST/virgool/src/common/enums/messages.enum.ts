export enum BadRequestMessage {
  InvalidLoginData = "اطلاعات وارد شده برای ورود صحیح نمیباشد",
  InvalidRegisterData = "اطلاعات وارد شده برای ثبت نام صحیح نمیباشد",
  InvalidImageFormat = "فرمت مجاز برای عکس : png - jpg - jpeg",
}

export enum AuthMessage {
  NotFoundAccout = "حساب کاربری یافت نشد",
  AlreadyExistAccount = "حساب کاربری با این مشخصات ثبت شده است",
  ExpiredToken = "کد یک بار مصرف منقضی شده است",
  TryLogin = "لطفا دوباره وارد شوید",
  LoginRequired = "ابتدا وارد حساب خود شوید",
}

export enum PublicMessage {
  SendOtp = "کد otp فرستاده شد",
  loginDone = "با موفقیت وارد شدید!",
  Created = "با موفقیت ایجاد شد",
  Deleted = "با موفقیت حذف شد",
  Updated = "با موفقیت ویرایش شد",
}

export enum ConflictMessage {
  CategoryTitle = "این عنوان قبلا استفاده شده است!",
}

export enum NotFoundMessage {
  NotFound = "موردی پیدا نشد!",
}
