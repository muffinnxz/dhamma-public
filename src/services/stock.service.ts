import admin from "@/lib/firebase-admin";
import { uploadBase64 } from "@/lib/firebase-storage";
import { DocumentSnapshot, DocumentData } from "firebase-admin/lib/firestore";
import * as crypto from "crypto";
import { Category, Stock } from "@/interfaces/stock";

export const getStocks = async (): Promise<DocumentSnapshot<DocumentData, DocumentData>[]> => {
  const fs = admin.firestore();
  const stocksRef = fs.collection("stocks");
  const stocks = await stocksRef.get();
  return stocks.docs;
};

export const getStock = async (stockId: string): Promise<DocumentSnapshot<DocumentData, DocumentData>> => {
  const fs = admin.firestore();
  const stockRef = fs.collection("stocks").doc(stockId);
  const stock = await stockRef.get();
  return stock;
};

export const createStock = async (
  name: string,
  description: string,
  price: number,
  thumbnail: string,
  stockCount: number,
  category: string
): Promise<DocumentSnapshot<DocumentData, DocumentData> | null> => {
  try {
    const fs = admin.firestore();
    const stockRef = fs.collection("stocks").doc();

    const id = crypto.randomBytes(4).toString("hex");
    const thumbnailPath = `stock-images/${id}.jpg`;
    const thumbnailUrl = await uploadBase64(thumbnail, thumbnailPath);

    const stock: Stock = {
      id: stockRef.id,
      name,
      description,
      price,
      thumbnail: thumbnailUrl,
      stock: stockCount,
      category:category as Category
    };
    await stockRef.set(stock);
    const stockSnapshot = await stockRef.get();
    return stockSnapshot;
  } catch (error) {
    console.error("Error adding stock: ", error);
    return null;
  }
};

export const updateStock = async (stockId: string, newData: Partial<Stock>): Promise<Stock | null> => {
  try {
    const fs = admin.firestore();
    const stockRef = fs.collection("stocks").doc(stockId);

    await stockRef.update(newData);
    const stockSnapshot = await stockRef.get();
    return stockSnapshot.data() as Stock;
  } catch (error) {
    console.error("Error updating stock: ", error);
    return null;
  }
};

export const deleteStock = async (stockId: string): Promise<boolean> => {
  try {
    const fs = admin.firestore();
    const stockRef = fs.collection("stocks").doc(stockId);
    await stockRef.delete();
    return true;
  } catch (error) {
    console.error("Error deleting stock: ", error);
    return false;
  }
};
