import { getOrderByPlaceId} from "@/services/order-history.service";
import { NextApiRequestWithUser, firebaseAuth } from "@/middlewares/auth";
import { NextApiResponse } from "next";

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    const placeId = req.user;
    if (req.method === "GET") {
        const orders = await getOrderByPlaceId(placeId as string);
        res.status(200).json({ message: "Success", data: orders });
    } else {
        res.status(405).end();
    }
}

export default firebaseAuth(handler);