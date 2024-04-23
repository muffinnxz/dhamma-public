// dhamma/src/pages/api/user/details.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "@/services/user.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const userData = await getUser(userId.toString());
    if (!userData?.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Assuming userData.data() returns user details including email and name
    const userDetails = userData.data();
    return res.status(200).json(userDetails);
  } catch (error) {
    console.error("Fetching user details failed:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
