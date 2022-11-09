export type ProductType = {
  name: string;
  brand: string;
  price: number;
  id: number;
  deleted: boolean;
};

export type ProductDtoType = {
  name: string;
  brand: string;
  price: number;
  id: number;
};

export const products: ProductType[] = [];
