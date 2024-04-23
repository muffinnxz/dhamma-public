import { NextApiRequest, NextApiResponse } from "next";
import { deleteComment, getCommentById } from "@/services/comment.service";
import { NextApiRequestWithUser, firebaseAuth } from "@/middlewares/auth";
import { getUser } from "@/services/user.service";

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
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

  const commentId = req.query.id;

  const existingComment = await getCommentById(commentId as string);
  if (!existingComment) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  if (existingComment!.userId !== userId) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  const flag = await deleteComment(commentId as string);
  if (!flag) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
  res.status(200).json({ message: "Success" });
};

export default firebaseAuth(handler);
