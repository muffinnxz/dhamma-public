import { getAllOrder, setOrder } from "@/services/order-history.service";
import { NextApiRequestWithUser, firebaseAuth } from "@/middlewares/auth";
import { NextApiResponse } from "next";
import { OrderDisplay } from "@/interfaces/order";

interface ExtendedNextApiRequest extends NextApiRequestWithUser {
  body: {
    orderDisplays: Array<OrderDisplay>;
  };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  if (req.method === "PUT") {
    const { orderDisplays } = req.body;
    const newOrderList = orderDisplays.map((order) => order);
    const response = await Promise.all(newOrderList.map((order) => setOrder(order)));
    res.status(201).json({ message: "Success", data: response });
  } else if (req.method === "GET") {
    const orders = await getAllOrder();
    res.status(200).json({ message: "Success", data: orders });
  } else {
    res.status(405).end();
  }
};

export default firebaseAuth(handler);
