import { NextApiRequestWithUser, firebaseAuth } from "@/middlewares/auth";
import { getApprovalList, getPlacesMap, requestForApproval } from "@/services/approve.service";
import { getUser } from "@/services/user.service";
import { ApproveDetail } from "@/interfaces/approve";
import { NextApiResponse } from "next";
import { PlaceVerifyStatus, UserData, UserType } from "@/interfaces/user";

interface ExtendedNextApiRequest extends NextApiRequestWithUser {
  body: {
    evident: string;
  };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  if (req.method == "GET") {
    const req_user = await getUser(req.user);
    const userData = req_user.data() as UserData;
    if (!req_user.exists || !userData) {
      res.status(400).json({ message: "Bad Request, unidentify user" });
      return;
    }
    if (!userData.isAdmin) {
      res.status(400).json({ message: "Bad Request, you are not admin" });
      return;
    }

    const apps = await getApprovalList();
    const place_ids = apps.map((ap) => ap.data()?.place_id);
    const placeMap = await getPlacesMap(place_ids);
    const approvalList: Array<ApproveDetail> = [];
    apps.forEach((ap) => {
      const apEvident = ap.data();
      if (!apEvident) {
        return;
      }
      const place = placeMap.get(apEvident.place_id);
      if (!place) {
        return;
      }
      const ap_detail: ApproveDetail = {
        id: apEvident.id,
        place_id: apEvident.place_id,
        evident: apEvident.evident,
        place: place as UserData
      };
      approvalList.push(ap_detail);
    });
    res
      .status(200)
      .json({
        message: "success",
        data: approvalList.filter((v) => v.place.placeVerified === PlaceVerifyStatus.pending)
      });
    return;
  } else if (req.method == "POST") {
    const { evident } = req.body;

    const req_user = await getUser(req.user);
    const userData = req_user.data() as UserData;
    if (!req_user.exists || !userData) {
      res.status(400).json({ message: "Bad Request, unidentify user" });
      return;
    }
    if (userData.userType != UserType.place) {
      res.status(400).json({ message: "Bad Request, you are not place" });
      return;
    }
    const result = await requestForApproval(req.user, evident);
    if (!result) {
      res.status(400).json({ message: "fail to request or already submitted" });
      return;
    }
    res.status(200).json({ message: "success" });
    return;
  }

  res.status(405).json({ message: "Method Not Allow" });
};

// without auth use for testing
// export default handler;

// with auth user for production
export default firebaseAuth(handler);
