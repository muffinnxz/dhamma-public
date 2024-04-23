import { PlaceType, UserData, UserType } from "@/interfaces/user";
import admin from "@/lib/firebase-admin";
import { uploadBase64 } from "@/lib/firebase-storage";
import { DocumentSnapshot, DocumentData } from "firebase-admin/lib/firestore";
import * as crypto from "crypto";
import { Place } from "@/interfaces/place";

export const getUser = async (userId: string): Promise<DocumentSnapshot<DocumentData, DocumentData> | null> => {
  if(userId === null) return null;
  const fs = admin.firestore();
  const userRef = fs.collection("users").doc(userId);
  const user = await userRef.get();
  return user;
};

export const createUser = async (
  userId: string,
  name: string,
  email: string,
  picture: string,
  userType: string,
  placeType?: string,
  placeLocation?: string,
  province?: string,
  postalCode?: string
): Promise<UserData | null> => {
  try {
    const fs = admin.firestore();
    const userRef = fs.collection("users").doc(userId);

    const id = crypto.randomBytes(4).toString("hex");
    const picturePath = `profile-images/${id}.jpg`;
    const pictureUrl = await uploadBase64(picture, picturePath);

    if (userType === UserType.place) {
      const user: UserData = {
        id: userId,
        name,
        email,
        picture: pictureUrl,
        userType: userType as UserType,
        placeType: placeType as PlaceType,
        placeLocation,
        province,
        postalCode
      };
      await userRef.set(user);
      return user;
    } else {
      const user: UserData = {
        id: userId,
        name,
        email,
        picture: pictureUrl,
        userType: userType as UserType
      };
      await userRef.set(user);
      return user;
    }
  } catch (error) {
    console.error("Error adding user: ", error);
    return null;
  }
};

export const updateUser = async (userId: string, newData: Partial<UserData>): Promise<UserData | null> => {
  try {
    const fs = admin.firestore();
    const userRef = fs.collection("users").doc(userId);

    const userData = await userRef.get();
    if (!userData.exists) {
      console.error("User not found");
      return null;
    }

    const updatedData: Partial<Record<keyof UserData, any>> = {};
    for (const key in newData) {
      if (key && newData[key as keyof UserData] !== undefined) {
        updatedData[key as keyof UserData] = newData[key as keyof UserData];
      }
    }

    await userRef.update(updatedData);
    const updatedUserData = { userId, ...userData.data(), ...updatedData } as UserData;
    return updatedUserData;
  } catch (error) {
    console.error("Error updating user: ", error);
    return null;
  }
};

export const getPlaces = async (): Promise<Place[]> => {
  const fs = admin.firestore();
  const usersRef = fs.collection("users");
  const placesData = await usersRef.where("userType", "==", UserType.place).get();
  const places: Place[] = [];
  placesData.forEach((place) => {
    const placeData = place.data() as Place;
    places.push(placeData);
  });
  return places;
}