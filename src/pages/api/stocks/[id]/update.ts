import { NextApiRequestWithUser, firebaseAuth } from "@/middlewares/auth";
import { updateStock } from "@/services/stock.service";
import { NextApiResponse } from "next";
import * as crypto from "crypto";
import { uploadBase64 } from "@/lib/firebase-storage";

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
    category: string;
  };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const stockId = req.query.id as string;
  const { thumbnail, name, description, price, stock: s, category } = req.body;

  if (!Boolean(thumbnail)) {
    const stock = await updateStock(stockId, {
      name,
      description,
      price,
      stock: s,
      category
    });
    return res.status(200).json({ message: "success", data: stock });
  }

  const id = crypto.randomBytes(4).toString("hex");
  const thumbnailPath = `stock-thumbnails/${id}.jpg`;
  const thumbnailUrl = await uploadBase64(thumbnail, thumbnailPath);

  const stock = await updateStock(stockId, {
    thumbnail: thumbnailUrl,
    name,
    description,
    price,
    stock: s
  });

  return res.status(200).json({ message: "success", data: stock });
};

export default firebaseAuth(handler);
