export enum ProductTypeEnum {
  Single = 'single',
  Coloring = 'coloring',
  Sizing = 'sizing',
}
export enum DiscountEnum {
  Product = 'product',
  Basket = 'basket',
}

export enum SwaggerConsumes {
  UrlEncoded = 'application/x-www-form-urlencoded',
  Json = 'application/json',
  Multipart = 'multipart/form-data',
}

export enum OrderStatus {
  Pending = 'pending',
  Ordered = 'ordered',
  InProgress = 'in-progress',
  Packed = 'packed',
  InTransit = 'in-transit',
  Canceled = 'canceled',
  Delivered = 'delivered',
}
