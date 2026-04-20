export enum EntityNames {
  User = "user",
  User_Address = "user_address",
  User_Basket = "user_basket",
  Category = "category",
  Supplier = "supplier",
  UserOtp = "user_otp",
  SupplierOtp = "supplier_otp",
  Menu = "menu",
  Type = "type",
  Order = "order",
  OrderItem = "order-item",
  Discount = "discount",
  Feedback = "feedback",
  Payment = "payment",
}

export enum FormTypes {
  Json = "application/json",
  UrlEncoded = "application/x-www-form-urlencoded",
  Multipart = "multipart/form-data",
}
export enum OrderStatus {
  Pending = "pending",
  Canceled = "canceled",
  Paid = "paid",
  Done = "done",
}
export enum OrderItemStatus {
  Pending = "pending",
  Canceled = "canceled",
  Send = "send",
}

export enum SupplierStatus {
  Registered = "registered",
  SuplementaryInfo = "suplementary-information",
  UploadedDoc = "uploaded-document",
  Contract = "contract",
}
export enum BasketDiscountType {
  Item = "item",
  Total = "total",
}
