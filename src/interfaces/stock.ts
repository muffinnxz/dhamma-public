export interface Stock {
  id: string;
  thumbnail: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
}

export enum Category {
  food = "Food & Drinks",
  cloth = "Cloth",
  book = "Book",
  electronic = "Electronic",
  other = "Others",
}
