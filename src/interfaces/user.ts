import { RequestItem } from "./request-item";

export enum UserType {
  donor = "donor",
  place = "place"
}

export enum PlaceType {
  budishm = "budishm",
  christianity = "christianity",
  hinduism = "hinduism",
  islam = "islam",
  judaism = "judaism",
  sikhism = "sikhism",
  other = "other"
}

export enum PlaceVerifyStatus {
  pending = "pending",
  verified = "verified",
  rejected = "rejected"
}

export interface UserData {
  id: string;
  name: string;
  email: string | undefined;
  picture: string;
  userType: UserType;
  placeType?: PlaceType;
  placeLocation?: string;
  province?: string;
  postalCode?: string;
  placeVerified?: PlaceVerifyStatus;
  isAdmin?: boolean;
  requestItems?: RequestItem[];
}
