import { Stock } from "@/interfaces/stock";

export interface RequestItem {
  id: string;
  amount: number;
}

export interface RequestItemDisplay {
  amount: number;
  stock: Stock | null;
}

export interface RequestItemWithPlace {
  user_place_id: string;
  stock_id: string;
  amount: number;
  stock: Stock | null;
}

export interface DonationItem {
  stock: Stock;
  donationAmount: number;
}

export enum SortMethod {
  name = "name",
  need = "need",
  price = "price",
  totalPrice = "total-price"
}
