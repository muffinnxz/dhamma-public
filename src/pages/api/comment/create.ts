import { NextApiRequestWithUser, firebaseAuth } from "@/middlewares/auth";
import { createComment } from "@/services/comment.service";
import { NextApiResponse } from "next";
import { getUser } from "@/services/user.service";

interface ExtendedNextApiRequest extends NextApiRequestWithUser {
  body: {
    placeId: string;
    comment: string;
  };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const userId = req.user;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const user = await getUser(userId);
  if (!user?.exists) {
    res.status(404).json({ message: "Not found user" });
    return;
  }
  if (user.data()!.userType !== "donor" && user.data()!.userType !== "place") {
    console.log(user.data()!.userType);
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const { placeId, comment } = req.body;

  const newComment = await createComment(userId, placeId, comment);
  if (!newComment) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
  res.status(200).json({ message: "Success", data: newComment });
};

export default firebaseAuth(handler);
