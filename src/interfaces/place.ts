import { UserType, PlaceType, PlaceVerifyStatus } from "./user";
import { RequestItem } from "./request-item";
export interface Place {
  id: string;
  name: string;
  picture: string;
  userType: UserType;
  placeType: PlaceType;
  placeLocation: string;
  province: string;
  postalCode: string;
  placeVerified: PlaceVerifyStatus;
  requestData: {requestItems: RequestItem[],requestMoney: number};
}