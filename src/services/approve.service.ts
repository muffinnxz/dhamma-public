import admin from "@/lib/firebase-admin";
import { DocumentSnapshot, DocumentData } from "firebase-admin/lib/firestore";
import { ApprovalEvident } from "@/interfaces/approve";
import { UserType, UserData, PlaceVerifyStatus } from "@/interfaces/user";
import { uploadBase64 } from "@/lib/firebase-storage";
import * as crypto from "crypto";

export const getPlacesMap = async (place_ids: Array<string>): Promise<Map<string, UserData>> => {
  const fs = admin.firestore();
  const placesRef = fs.collection("users").where("userType", "==", UserType.place).where("id", "in", place_ids);
  const placesMap: Map<string, UserData> = new Map();
  const places = await placesRef.get();
  places.docs.forEach((place) => {
    placesMap.set(place.id, place.data() as UserData);
  });
  return placesMap;
};

export const getApprovalList = async (): Promise<DocumentSnapshot<DocumentData, DocumentData>[]> => {
  const fs = admin.firestore();
  const placeRef = fs.collection("approve_evidents");
  const place = await placeRef.get();
  return place.docs;
};

export const setApproval = async (placeId: string, decided: boolean): Promise<boolean> => {
  try {
    const fs = admin.firestore();
    const placeRef = fs.collection("users").doc(placeId);
    const place = await placeRef.get();
    if (place.data()?.userType != UserType.place || place.data()?.placeVerified != PlaceVerifyStatus.pending) {
      return false;
    }
    await placeRef.update({ placeVerified: decided ? PlaceVerifyStatus.verified : PlaceVerifyStatus.rejected });
    return true;
  } catch (error) {
    console.error("Error setting approval: ", error);
    return false;
  }
};

export const requestForApproval = async (placeId: string, picture: string): Promise<boolean> => {
  try {
    const fs = admin.firestore();
    const placeRef = fs.collection("users").doc(placeId);
    const place = await placeRef.get();
    if (place.data()?.userType != UserType.place || place.data()?.placeVerified == PlaceVerifyStatus) {
      return false;
    }
    const pid = crypto.randomBytes(4).toString("hex");
    const picturePath = `profile-images/${pid}.jpg`;
    const pictureUrl = await uploadBase64(picture, picturePath);
    const approvalRef = fs.collection("approve_evidents").doc();

    const ape: ApprovalEvident = {
      place_id: placeId,
      evident: pictureUrl
    };

    await approvalRef.set(ape);
    await placeRef.update({ placeVerified: PlaceVerifyStatus.pending });
    return true;
  } catch (error) {
    console.error("Error setting approval: ", error);
    return false;
  }
};
