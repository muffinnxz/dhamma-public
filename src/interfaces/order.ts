import { RequestItem } from "./request-item";

export enum OrderStatus {
  pending = "pending",
  paid = "paid",
  delivering = "delivering",
  received = "received"
}

export interface Order {
  id: string;
  itemList: RequestItem[];
  donationAmount: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  donorId: string;
  placeId: string;
  isBlessed: boolean;
}

export interface OrderDisplay {
  id: string;
  status: OrderStatus;
}
