import { getUser } from "@/services/user.service";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const userId = req.query.id as string;
    
    const user = await getUser(userId);
    const userData = user.data();
    if (!user.exists || userData?.userType !== "place") {
        res.status(404).json({ message: "Not found" });
        return;
    }

    delete userData?.email;

    res.status(200).json({ message: "success", data: userData });
};

export default handler;