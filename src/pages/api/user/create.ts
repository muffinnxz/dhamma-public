import { NextApiRequest, NextApiResponse } from "next";
import { getUser, createUser } from "@/services/user.service";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb"
    }
  }
};

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    id: string;
    name: string;
    email: string;
    picture: string;
    userType: string;
    placeType?: string;
    placeLocation?: string;
    province?: string;
    postalCode?: string;
  };
}

const validateRequest = (req: ExtendedNextApiRequest): boolean => {
  const { name, email } = req.body;
  const emailRegex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  if (!emailRegex.test(email)) {
    return false;
  }
  if (typeof name === "string") {
    return true;
  }
  return false;
};

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  if (!validateRequest(req)) {
    res.status(400).json({ message: "Bad request" });
    return;
  }
  const { id: userId, name, email, picture, userType, placeType, placeLocation, province, postalCode } = req.body;
  const userData = await getUser(userId);
  if (userData?.exists) {
    res.status(409).json({ message: "Conflict" });
    return;
  }
  const user = await createUser(userId, name, email, picture, userType, placeType, placeLocation, province, postalCode);
  if (!user) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
  res.status(200).json({ message: "Success", data: user });
};

export default handler;
