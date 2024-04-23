import admin from "@/lib/firebase-admin";
import { RequestItem } from "@/interfaces/request-item";
import { Stock } from "@/interfaces/stock";
import { UserType } from "@/interfaces/user";

export const getStocksMap = async (): Promise<Map<string, Stock>> => {
  const fs = admin.firestore();
  const stocksRef = fs.collection("stocks");
  const stocksMap: Map<string, Stock> = new Map();
  const stocks = await stocksRef.get();
  stocks.docs.forEach((stock) => {
    stocksMap.set(stock.id, stock.data() as Stock);
  });
  return stocksMap;
};

export const getRequestData = async (
  placeId: string
): Promise<{ requestItems: Array<RequestItem> | null; requestMoney: number | null }> => {
  const fs = admin.firestore();
  const placeRef = fs.collection("users").doc(placeId);
  const place = await placeRef.get();

  if (!place.exists || place.data()?.userType !== UserType.place || !place.data()) {
    return { requestItems: null, requestMoney: null };
  }
  return {
    requestItems: place.data()?.requestData?.requestItems || [],
    requestMoney: place.data()?.requestData?.requestMoney || null
  };
};

export const deleteAllRequestItem = async (placeId: string): Promise<boolean> => {
  try {
    const fs = admin.firestore();
    const placeRef = fs.collection("users").doc(placeId);
    const place = await placeRef.get();
    if (place.data()?.userType != UserType.place) {
      return false;
    }
    await placeRef.update({ requestData: null });
    return true;
  } catch (error) {
    console.error("Error removing requestData from place: ", error);
    return false;
  }
};

export const setRequestItem = async (
  placeId: string,
  requestItems: Array<RequestItem>,
  requestMoney: number
): Promise<{ requestItems: Array<RequestItem> | null; requestMoney: number | null }> => {
  try {
    const fs = admin.firestore();
    const placeRef = fs.collection("users").doc(placeId);
    const place = await placeRef.get();
    if (place.data()?.userType !== UserType.place) {
      return { requestItems: null, requestMoney: null };
    }

    const updateData: {
      requestData: {
        requestItems: RequestItem[];
        requestMoney?: number;
      };
    } = {
      requestData: {
        requestItems: requestItems
      }
    };

    if (requestMoney !== null && requestMoney > 0) {
      updateData.requestData.requestMoney = requestMoney;
    }

    await placeRef.update(updateData);
    const placeSnapshot = await placeRef.get();
    return {
      requestItems: placeSnapshot.data()?.requestData?.requestItems || null,
      requestMoney: placeSnapshot.data()?.requestData?.requestMoney || null
    };
  } catch (error) {
    console.error("Error setting place request: ", error);
    return { requestItems: null, requestMoney: null };
  }
};
