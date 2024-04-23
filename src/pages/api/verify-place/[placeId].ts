import { NextApiRequestWithUser, firebaseAuth } from "@/middlewares/auth";
import { setApproval } from "@/services/approve.service";
import { getUser } from "@/services/user.service";
import { NextApiResponse } from "next";
import { UserData } from "@/interfaces/user";

interface ExtendedNextApiRequest extends NextApiRequestWithUser {
  body: {
    approve: boolean;
  };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const placeId = req.query.placeId as string;
    const { approve } = req.body;

    const req_user = await getUser(req.user);
    const userData = req_user.data() as UserData;
    if (!req_user.exists || !userData) {
      res.status(400).json({ message: "Bad Request, unidentify user" });
      return;
    }
    if (!userData.isAdmin) {
      res.status(400).json({ message: "Bad Request, you are not admin" });
      return;
    }
    const result = await setApproval(placeId, approve);
    if (!result) {
      res.status(400).json({ message: "fail to set approval or place already set approval" });
      return;
    }
    res.status(200).json({ message: "success" });
    return;
  }

  res.status(405).json({ message: "Method Not Allow" });
};

// without auth use for testing
// export default handler;

// with auth user for production
export default firebaseAuth(handler);
