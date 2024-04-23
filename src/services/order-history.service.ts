import admin from "@/lib/firebase-admin";
import { Order } from "@/interfaces/order";
import { OrderDisplay } from "@/interfaces/order";

export const getAllOrder = async (): Promise<Array<Order> | null> => {
  const fs = admin.firestore();
  const orderRef = fs.collection("orders");
  return orderRef.get().then((orders) => {
    const orderList: Array<Order> = [];
    orders.docs.forEach((order) => {
      orderList.push(order.data() as Order);
    });
    return orderList;
  });
};

export const getOrder = async (orderId: string): Promise<Order | null> => {
  const fs = admin.firestore();
  const orderRef = fs.collection("orders").doc(orderId);
  return orderRef.get().then((order) => {
    return order.data() as Order;
  });
};

export const getOrderByDonorId = async (donorId: string): Promise<Array<Order> | null> => {
  const fs = admin.firestore();
  const orderRef = fs.collection("orders").where("donorId", "==", donorId);
  return orderRef.get().then((orders) => {
    const orderList: Array<Order> = [];
    orders.docs.forEach((order) => {
      orderList.push(order.data() as Order);
    });
    return orderList;
  });
};

export const getOrderByPlaceId = async (placeId: string): Promise<Array<Order> | null> => {
  const fs = admin.firestore();
  const orderRef = fs.collection("orders").where("placeId", "==", placeId);
  return orderRef.get().then((orders) => {
    const orderList: Array<Order> = [];
    orders.docs.forEach((order) => {
      orderList.push(order.data() as Order);
    });
    return orderList;
  });
};

export const setOrder = async (newData: OrderDisplay): Promise<OrderDisplay | null> => {
  try {
    const fs = admin.firestore();
    const orderRef = fs.collection("orders").doc(newData.id);
    await orderRef.update({ status: newData.status });
    return newData;
  } catch (error) {
    console.error("Error setting order: ", error);
    return null;
  }
};
