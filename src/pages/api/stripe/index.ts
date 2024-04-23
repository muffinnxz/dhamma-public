import admin from "@/lib/firebase-admin";
import { NextApiRequestWithUser, firebaseAuth } from "@/middlewares/auth";
import type { NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";
import { UserData } from "@/interfaces/user";
import { DonationItem } from "@/interfaces/request-item";
import { createOrder } from "@/services/order.service";

interface ExtendedNextApiRequest extends NextApiRequestWithUser {
  body: {
    placeId: string;
    items: DonationItem[];
    donationMoney: number;
  };
}

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  const fs = admin.firestore();
  const userId = req.user;
  const user = await fs.collection("users").doc(userId).get();

  const { placeId, items, donationMoney } = (req as ExtendedNextApiRequest).body;

  if (!user.exists) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const lineItems = items.map((item) => ({
    price_data: {
      currency: "thb",
      product_data: {
        name: item.stock.name
      },
      unit_amount: item.stock.price * 100
    },
    quantity: item.donationAmount
  }));

  lineItems.push({
    price_data: {
      currency: "thb",
      product_data: {
        name: "Donation"
      },
      unit_amount: donationMoney * 100
    },
    quantity: 1
  });
  // console.log(lineItems)

  const userData = user.data() as UserData;
  try {
    const order = await createOrder(userId, placeId, items, donationMoney);
    if (!order) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    const successRedirectUrl = `${process.env.NEXT_PUBLIC_ORIGIN_URL}/place/${placeId}?payment=success&orderId=${order.id}`;
    const cancelRedirectUrl = `${process.env.NEXT_PUBLIC_ORIGIN_URL}/place/${placeId}?payment=cancel&orderId=${order.id}`;
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: successRedirectUrl,
      cancel_url: cancelRedirectUrl,
      payment_method_types: ["card", "promptpay"],
      mode: "payment",
      billing_address_collection: "auto",
      customer_email: userData.email,
      line_items: lineItems,
      metadata: {
        orderId: order.id
      }
    });
    res.status(200).json({ message: "Success", data: stripeSession });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default firebaseAuth(handler);
