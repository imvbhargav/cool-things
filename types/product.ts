export interface ProductInfo {
  id: string,
  imageLink: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  offer: number;
  minorder: number;
  minonoffer: boolean;
}

export interface Product {
  product: ProductInfo;
}

export interface CartItem {
  product: ProductInfo;
  quantity: number;
  subTotal: number;
}