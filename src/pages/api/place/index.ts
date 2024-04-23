import { getPlaces } from "@/services/user.service";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const places = await getPlaces();
    places.forEach((place) => {
        delete place.email;
    });

    res.status(200).json({ message: "success", data: places });
};

export default handler;