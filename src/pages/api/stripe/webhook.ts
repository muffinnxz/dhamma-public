import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { paidOrder } from "@/services/order.service";

export const config = {
  api: {
    bodyParser: false
  }
};

// Function to read the raw body
const readRawBody = (req: any) => {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk: any) => {
      data += chunk;
    });
    req.on("end", () => {
      resolve(data);
    });
    req.on("error", (err: any) => {
      reject(err);
    });
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = (await readRawBody(req)) as string;
  const signature = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET || "");
  } catch (error: any) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (!session?.metadata?.orderId) {
    return res.status(400).send("Missing metadata");
  }

  if (event.type === "checkout.session.completed") {
    await paidOrder(session.metadata.orderId);
  }

  return res.status(200).json({ received: true });
};

export default handler;
