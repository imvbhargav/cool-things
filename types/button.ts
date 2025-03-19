import { Product } from "@prisma/client";

export interface ButtonProperties {
  color: string,
  text: string,
  action: ((item: Product) => void) | (() => void) | null;
}

export interface ButtonTypes {
  [key: string]: ButtonProperties,
}