import { getRequestData, getStocksMap, deleteAllRequestItem, setRequestItem } from "@/services/request-item.service";
import { RequestItemDisplay } from "@/interfaces/request-item";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const placeId = req.query.id as string;

  if (req.method === "GET") {
    const requestData = await getRequestData(placeId);
    const requestItems = requestData.requestItems;
    const requestMoney = requestData.requestMoney;
    if (!requestItems && !requestMoney) {
      res.status(404).json({ message: "Not Found" });
      return;
    }

    const stockMap = await getStocksMap();
    const requestItemList: Array<RequestItemDisplay> = [];

    if (requestItems) {
      requestItems.forEach((item) => {
        requestItemList.push({ stock: stockMap.get(item.id) ?? null, amount: item.amount });
      });
    }

    let responseData = {
      message: "success",
      data: {
        requestItems: null as RequestItemDisplay[] | null,
        requestMoney: null as number | null
      }
    };

    if (requestItemList.length > 0) {
      responseData.data.requestItems = requestItemList;
    } else {
      responseData.data.requestItems = [];
    }

    if (requestMoney !== null) {
      responseData.data.requestMoney = requestMoney;
    }
    res.status(200).json(responseData);
  }
};

export default handler;
