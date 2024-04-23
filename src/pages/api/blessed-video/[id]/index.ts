import { NextApiRequestWithUser, firebaseAuth } from "@/middlewares/auth";
import { UserType } from "@/interfaces/user";
import { Place } from "@/interfaces/place";
import { getBlessedOrderById, postBlessedVideo } from "@/services/blessed-vid.service";
import { getUser } from "@/services/user.service"
import { BlessedVideo } from "@/interfaces/blessedVideo";
import { NextApiResponse } from "next";


interface ExtendedNextApiRequest extends NextApiRequestWithUser {
  body: {
    title: string;
    desc: string;
    video: string;
  };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {

  const userId = req.user;
  const orderId = req.query.id as string;

  if (req.method == "GET") {
    
    const bVid: BlessedVideo | null = await getBlessedOrderById(orderId);

    if (bVid == null) {
      res.status(404).json({ message: "Not Found" });
      return;
    }

    console.log(bVid.createdAt, typeof bVid.createdAt);

    if (userId != bVid.donorId && userId != bVid.placeId){
      res.status(401).json({ message: "UnAuthorize, you can't watch this content!" });
      return;
    }

    const userPlace = await getUser(bVid.placeId);
    if (!userPlace.exists || userPlace.data()?.userType != UserType.place){
      res.status(200).json({ message: "success", data: bVid });
      return;
    }

    const place = userPlace.data() as Place;
    bVid.placeName = place.name;
    bVid.placePicture = place.picture;

    res.status(200).json({ message: "success", data: bVid });
    return;
}
  else if(req.method == "POST"){
    const user = await getUser(userId);
    const { video, title, desc } = req.body;

    const userData = user.data();
    if (!user.exists || userData!.userType !== UserType.place) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const result = await postBlessedVideo(orderId, userId, video ,title, desc);
    if (!result){
      res.status(400).json({ message: "Cannot blessed order" });
      return;
    }
    res.status(200).json({ message: "success"});
    return;
  }

  res.status(405).json({ message: "Method Not Allow" });
};

export default firebaseAuth(handler);
