import { Order, OrderStatus } from "@/interfaces/order";
import { DonationItem, RequestItem } from "@/interfaces/request-item";
import { DocumentSnapshot, DocumentData } from "firebase-admin/lib/firestore";
import admin from "@/lib/firebase-admin";

export const createOrder = async (
  donorId: string,
  placeId: string,
  items: DonationItem[],
  donationMoney:number
): Promise<DocumentSnapshot<DocumentData, DocumentData> | null> => {
  try {
    const fs = admin.firestore();
    const orderRef = fs.collection("orders").doc();
    const order: Order = {
      id: orderRef.id,
      donorId,
      placeId,
      itemList: items.map((item) => ({ id: item.stock.id, amount: item.donationAmount })),
      status: OrderStatus.pending,
      isBlessed: false,
      donationAmount: donationMoney,
      totalPrice: items.reduce((acc, item) => acc + item.donationAmount * item.stock.price, 0) + donationMoney,
      createdAt: new Date()
    };
    await orderRef.set(order);
    const orderSnapshot = await orderRef.get();
    return orderSnapshot;
  } catch (error) {
    console.error("Error adding order: ", error);
    return null;
  }
};

export const paidOrder = async (orderId: string): Promise<boolean> => {
  try {
    const fs = admin.firestore();
    await fs.collection("orders").doc(orderId).update({ status: OrderStatus.paid });
    return true;
  } catch (error) {
    console.error("Error updating order: ", error);
    return false;
  }
};

export const getOrderByPlaceId = async (placeId:string): Promise<Order[]> => {
  try {
    const fs = admin.firestore();
    const orders = await fs.collection("orders").get().then((snapshot) => {
      return snapshot.docs.filter((doc) => doc.data().placeId === placeId);
    });

    // sort by "createdAt" field and select only lasted 5 orders
    orders.sort((a, b) => (a.data().createdAt < b.data().createdAt ? 1 : -1));
    return orders.slice(0, 5).map((doc) => doc.data() as Order); 
  } catch (error) {
    console.error("Error getting orders: ", error);
    return [];
  }
}

