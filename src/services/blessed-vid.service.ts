import admin from "@/lib/firebase-admin";
import { BlessedVideo } from "@/interfaces/blessedVideo";
import { Order } from "@/interfaces/order"
import { uploadFileToFirestorage } from "@/lib/firebase-storage";
import * as crypto from "crypto";

export const getBlessedOrderById = async (orderId: string): Promise<BlessedVideo | null> => {

  const fs = admin.firestore();
  const bVidRef = fs.collection("orders").doc(orderId);
  const bVid = await bVidRef.get();
  
  if (!bVid.exists){
    return null;
  }

  const order = bVid.data() as Order;
  // firebase Timestamp to ts Date
  order.createdAt = bVid.data()?.createdAt.toDate();
  const vid = bVid.data()?.blessedVideo;
  if (!order.isBlessed || vid==null){
    return null;
  }

  const bVidBody: BlessedVideo = {
    title: vid.title,
    desc: vid.desc,
    url: vid.url,
    createdAt: order.createdAt,
    placeName: "",
    placePicture: "",
    placeId: order.placeId,
    orderId: order.id,
    donorId: order.donorId
  }
  return bVidBody;
};

export const postBlessedVideo = async (
  orderId: string,
  placeId: string,
  fileB64: string,
  title: string,
  desc: string
  ): Promise<boolean> => {

  const fs = admin.firestore();
  const ordersRef = fs.collection("orders").doc(orderId);
  const orderData = (await ordersRef.get()).data()
  if (orderData?.isBlessed || placeId != orderData?.placeId){
      return false;
  }

  const id = crypto.randomBytes(4).toString("hex");
  const fVideo = dataURLtoFile(fileB64,`${id}.mp4`);

  try{
  const url = await uploadFileToFirestorage(fVideo,"blessed-video",`${id}.mp4`);

  await ordersRef.update(
      {isBlessed:true,
      blessedVideo:{
          title: title,
          desc: desc,
          url: url
      }});
  return true;
  }
  catch (err){
      console.log("error post blessed video", err)
      return false;
  }
};


function dataURLtoFile(dataurl: string, filename: string) {
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/),
      bstr = atob(arr[arr.length - 1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  var mtype = "video/mp4";
  if (mime != null){
    mtype = mime[1];
  }
  return new File([u8arr], filename, {type:mtype});
}