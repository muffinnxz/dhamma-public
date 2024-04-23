import { NextApiResponse } from "next";

import { NextApiRequestWithUser, firebaseAuth } from "@/middlewares/auth";
import { getUser } from "@/services/user.service";
import { createOrder } from "@/services/order.service";
import { DonationItem } from "@/interfaces/request-item";

interface ExtendedNextApiRequest extends NextApiRequestWithUser {
  body: {
    placeId: string;
    items: DonationItem[];
    donationMoney: number;
  };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const userId = req.user;
  const user = await getUser(userId);

  if (!user?.exists) {
    res.status(404).json({ message: "Not found user" });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const userData = user.data();
  const donationMoney = req.body.donationMoney;
  if (userData!.userType !== "donor") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const { placeId, items } = req.body;
  const place = await getUser(placeId);
  if (!place?.exists) {
    res.status(404).json({ message: "Not found place" });
    return;
  }
  const order = await createOrder(userId, placeId, items, donationMoney);
  if (!order) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
  res.status(200).json({ message: "Success", data: order });
};

export default firebaseAuth(handler);
