import { NextApiRequestWithUser, firebaseAuth } from "@/middlewares/auth";
import { deleteStock, getStock } from "@/services/stock.service";
import { NextApiResponse } from "next";

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  const stockId = req.query.id as string;
  const stock = await deleteStock(stockId);
  if (!stock) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.status(200).json({ message: "success", data: stock });
};

export default firebaseAuth(handler);
