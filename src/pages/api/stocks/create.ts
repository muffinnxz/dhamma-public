import { NextApiResponse } from "next";
import * as crypto from "crypto";
import { uploadBase64 } from "@/lib/firebase-storage";
import { createStock } from "@/services/stock.service";
import { NextApiRequestWithUser, firebaseAuth } from "@/middlewares/auth";
import { Category } from "@/interfaces/stock";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb"
    }
  }
};

interface ExtendedNextApiRequest extends NextApiRequestWithUser {
  body: {
    thumbnail: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category:string;
  };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const { thumbnail, name, description, price, stock: stockCount, category } = req.body;

  const id = crypto.randomBytes(4).toString("hex");
  const thumbnailPath = `stock-thumbnails/${id}.jpg`;
  const thumbnailUrl = await uploadBase64(thumbnail, thumbnailPath);

  const stock = await createStock(name, description, price, thumbnailUrl, stockCount, category);
  if (!stock) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
  const stockData = stock.data();
  res.status(200).json({ message: "Success", data: stockData });
};

export default firebaseAuth(handler);
