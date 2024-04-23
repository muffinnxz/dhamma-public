import { getOrderByDonorId} from "@/services/order-history.service";
import { NextApiRequestWithUser, firebaseAuth } from "@/middlewares/auth";
import { NextApiResponse } from "next";

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    const donorId = req.user;
    if (req.method === "GET") {
        const orders = await getOrderByDonorId(donorId as string);
        res.status(200).json({ message: "Success", data: orders });
    } else {
        res.status(405).end();
    }
}

export default firebaseAuth(handler);