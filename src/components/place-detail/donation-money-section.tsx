import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
type SliderProps = React.ComponentProps<typeof Slider>;
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import useUser from "@/hooks/use-user";
import { DonationMoney } from "@/interfaces/cart";
import { LuLoader } from "react-icons/lu";
import { toast } from "@/components/ui/use-toast";
import axios from "@/lib/axios";
import { set } from "react-hook-form";
export default function DonationMoneySection({
  id,
  requestMoney,
  isLoading
}: {
  id: string;
  requestMoney: number;
  isLoading: boolean;
}) {
  const { donationMoneys, setDonationMoneys } = useUser();
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  let foundDonationMoney = donationMoneys?.find((donation) => donation.placeId === id);
  if (!foundDonationMoney) {
    setDonationMoneys([...(donationMoneys ?? []), { placeId: id, amount: 0 }]);
  }

  const [isSending, setIsSending] = useState<boolean>(false);

  const saveToCart = (donationMoney: number) => {
    // console.log(donationMoney)
    donationMoney = Math.min(donationMoney, requestMoney);
    donationMoney = Math.max(donationMoney, 0);
    let donation = {
      placeId: id,
      amount: donationMoney
    };

    let newDonationMoneys =
      donationMoneys?.map((donationMoney) => {
        if (donationMoney.placeId === id) {
          return donation;
        }
        return donationMoney;
      }) ?? [];
    setDonationMoneys(newDonationMoneys);
  };

  const makeOrder = () => {
    // console.log(donationMoneys)
    // console.log(donationMoneys?.find((donation) => donation.placeId === id)?.amount,id)
    setIsSending(true);
    axios
      .post(`/stripe`, {
        placeId: id,
        items: [],
        donationMoney: donationMoneys?.find((donation) => donation.placeId === id)?.amount
      })
      .then(({ data }) => {
        setIsSending(false);
        toast({
          title: "Creating a new order."
        });
        window.location.replace(data.data.url);
      })
      .catch((err) => {
        setIsSending(false);
        console.error(err);
        toast({
          title: "An error occurred.",
          description: err.message
        });
      });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-5xl font-bold">DONATION MONEY</div>
      <div className="px-5 space-y-3">
        <div className="text-2xl font-bold">Request {requestMoney} $</div>
        <div className="text-lg">How much do you want to donate?</div>
        <Input
          type="number"
          onChange={(event) => saveToCart(parseInt(event.target.value))}
          defaultValue={donationMoneys?.find((donation) => donation.placeId === id)?.amount}
        ></Input>
        <div className="flex gap-3">
          <Button
            onClick={() => makeOrder()}
            disabled={donationMoneys?.find((donation) => donation.placeId === id)?.amount! < 10 || isSending}
          >
            {isSending && <LuLoader className="animate-spin mr-2 h-4 w-4" />}
            Donate now
          </Button>
          {/* <Button onClick={()=>setDonationMoneys(donationMoneys)}>Save in cart</Button> */}
        </div>
      </div>
    </div>
  );
}
