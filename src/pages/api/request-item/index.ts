import { NextApiRequestWithUser, firebaseAuth } from "@/middlewares/auth";
import { getRequestData, getStocksMap, deleteAllRequestItem, setRequestItem } from "@/services/request-item.service";
import { RequestItem, RequestItemDisplay } from "@/interfaces/request-item";
import { NextApiResponse } from "next";
import { Stock } from "@/interfaces/stock";

interface ExtendedNextApiRequest extends NextApiRequestWithUser {
  body: {
    requestList: Array<{ stock: Stock; amount: number }>;
    requestMoney: number;
  };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const placeId = req.user;
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
  } else if (req.method === "PUT") {
    const { requestList, requestMoney } = req.body;
    if (!requestList && !requestMoney) {
      res.status(400).json({ message: "Bad Request, body required needs_list" });
      return;
    }
    const request_list_non_zero: Array<RequestItem> = [];
    requestList.forEach((request) => {
      if (request.amount > 0 && request.stock !== null) {
        request_list_non_zero.push({ id: request.stock.id, amount: request.amount });
      }
    });
    const requestData = await setRequestItem(placeId, request_list_non_zero, requestMoney);

    if (!requestData.requestItems && requestData.requestMoney === null) {
      res.status(404).json({ message: "Not Found" });
      return;
    }

    const stockMap = await getStocksMap();
    const requestItemList: Array<RequestItemDisplay> = [];

    if (requestData.requestItems) {
      requestData.requestItems.forEach((item) => {
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
    }

    if (requestData.requestMoney !== null) {
      responseData.data.requestMoney = requestMoney;
    }

    res.status(200).json(responseData);
  } else if (req.method == "DELETE") {
    const status = await deleteAllRequestItem(placeId);
    if (!status) {
      res.status(404).json({ message: "Not Found" });
      return;
    }
    res.status(200).json({ message: "success" });
    return;
  }

  res.status(405).json({ message: "Method Not Allow" });
};

export default firebaseAuth(handler);
