import { NextApiRequest, NextApiResponse } from "next";
import { updateComment, getCommentById } from "@/services/comment.service";
import { NextApiRequestWithUser, firebaseAuth } from "@/middlewares/auth";
import { getUser } from "@/services/user.service";

interface ExtendedNextApiRequest extends NextApiRequestWithUser {
  body: {
    commentId: string;
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
  if (!user.exists) {
    res.status(404).json({ message: "Not found user" });
    return;
  }

  const { commentId, comment } = req.body;

  const existingComment = await getCommentById(commentId as string);
  if (!existingComment) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  if (existingComment!.userId !== userId) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  const updatedComment = await updateComment(commentId as string, comment);
  if (!updatedComment) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
  res.status(200).json({ message: "Success", data: updatedComment });
};

export default firebaseAuth(handler);
