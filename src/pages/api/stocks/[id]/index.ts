import { NextApiRequestWithUser, firebaseAuth } from "@/middlewares/auth";
import { getStock } from "@/services/stock.service";
import { NextApiResponse } from "next";

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  const stockId = req.query.id as string;
  const stock = await getStock(stockId);
  if (!stock.exists) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  const stockData = stock.data();
  res.status(200).json({ message: "success", data: stockData });
};

export default firebaseAuth(handler);