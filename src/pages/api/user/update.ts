// dhamma/src/pages/api/user/update.ts
import { NextApiRequest, NextApiResponse } from "next";
import { updateUser } from "@/services/user.service";
import { UserData, UserType, PlaceType } from "@/interfaces/user";

// Extend the NextApiRequest type to include the expected body data
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    id: string;
    name?: string;
    picture?: string;
    userType?: UserType;
    placeType?: PlaceType;
    placeLocation?: string;
    province?: string;
    postalCode?: string;
  };
}

export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { id, ...updates } = req.body;

  // Validate the required fields
  if (!id) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  try {
    const updatedUser = await updateUser(id, updates);
    if (!updatedUser) {
      res.status(404).json({ message: "User not found or update failed" });
      return;
    }
    res.status(200).json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}