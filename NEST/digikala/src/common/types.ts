export interface DiscountResult {
  newPrice: number;
  newDiscountAmount: number;
}

export interface BasketProduct {
  id: number;
  slug: string;
  title: string;
  active_discount: boolean;
  price: number;
  count?: number;  // ← add this
  discount: number;
  sizeId?: number;
  size?: string;
  colorId?: number;
  color_code?: string;
  color_name?: string;
}

export interface AppliedDiscount {
  code: string;
  type: string;
  percent: number | null;
  amount: number | null;
  productId: number | null;
}

export interface BasketResult {
  totalPrice: number;
  finalAmount: number;
  totalDiscountAmount: number;
  products: BasketProduct[];
  discounts: AppliedDiscount[];
}