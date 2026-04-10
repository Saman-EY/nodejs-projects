export enum BadRequestMessage {
  InvalidLoginData = "اطلاعات وارد شده برای ورود صحیح نمیباشد",
  InvalidRegisterData = "اطلاعات وارد شده برای ثبت نام صحیح نمیباشد",
  InvalidCategoriesData = "فرمت ارسالی برای دسته بندی نادرست است",
  InvalidImageFormat = "فرمت مجاز برای عکس : png - jpg - jpeg",
  AlreadyAccepted = "کامنت قبلا تایید شده است",
  AlreadyRejected = "کامنت قبلا رد شده است",
}

export enum AuthMessage {
  NotFoundAccout = "حساب کاربری یافت نشد",
  AlreadyExistAccount = "حساب کاربری با این مشخصات ثبت شده است",
  ExpiredToken = "توکن شما منقضی شده است",
  ExpiredCode = "کد یک بار مصرف منقضی شده است",
  TryLogin = "لطفا دوباره وارد شوید",
  TryAgain = "لطفا دوباره تلاش کنید",
  SomethingWrong = "یک مشکلی پیش آمد",
  LoginRequired = "ابتدا وارد حساب خود شوید",
  Permission = "شما اجازه انجام این کار را ندارید!",
}

export enum PublicMessage {
  SendOtp = "کد otp فرستاده شد",
  loginDone = "با موفقیت وارد شدید!",
  Created = "با موفقیت ایجاد شد",
  Deleted = "با موفقیت حذف شد",
  Updated = "با موفقیت ویرایش شد",
  Like = "با موفقیت لایک شد",
  UnLike = "با موفقیت لایک برداشته شد",
  Marked = "با موفقیت ذخیره شد",
  UnMarked = "با موفقیت حذف شد",
}

export enum ConflictMessage {
  CategoryTitle = "این عنوان قبلا استفاده شده است!",
  Email = "این ایمیل قبلا استفاده شده است!",
  Phone = "این شماره قبلا استفاده شده است!",
  Username = "این اسم قبلا استفاده شده است!",
}

export enum NotFoundMessage {
  NotFound = "موردی پیدا نشد!",
}

export enum ValidationMessage {
  InvalidEmail = "ایمیل معتبر نیست",
  InvalidPhone = "موبایل معتبر نیست",
}
export enum ForbiddenMessage {
  Forbidden = "عدم دسترسی",
}
