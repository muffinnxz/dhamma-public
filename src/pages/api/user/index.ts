import { NextApiRequestWithUser, firebaseAuth } from "@/middlewares/auth";
import { getUser } from "@/services/user.service";
import { NextApiResponse } from "next";

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  const userId = req.user;
  const user = await getUser(userId);
  if (!user.exists) {
    res.status(404).json({ message: "Not found user" });
    return;
  }
  const userData = user.data();
  res.status(200).json({ message: "Success", data: userData });
};

export default firebaseAuth(handler);
