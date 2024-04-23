import { NextApiRequestWithUser, firebaseAuth } from "@/middlewares/auth";
import { getStocks } from "@/services/stock.service";
import { NextApiResponse } from "next";

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  const stocks = await getStocks();
  const stocksData = stocks.map((stock) => stock.data());
  res.status(200).json({ message: "success", data: stocksData });
};

export default firebaseAuth(handler);
