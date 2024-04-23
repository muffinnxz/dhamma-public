import { NextApiRequest, NextApiResponse } from "next";
import { getCommentsByPlaceId } from "@/services/comment.service";
import { getUser } from "@/services/user.service";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const placeId = req.query.id;
  const place = await getUser(placeId as string);
  if (!place?.exists) {
    res.status(404).json({ message: "Not found place" });
    return;
  }
  if (place.data()!.userType !== "place") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  const comments = await getCommentsByPlaceId(placeId as string);
  if (!comments) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
  res.status(200).json({ message: "Success", data: comments });
};

export default handler;
