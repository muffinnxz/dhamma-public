import Image from "next/image";
import React, { use, useEffect, useState } from "react";

import useUser from "@/hooks/use-user";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { FaHeart } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Stock } from "@/interfaces/stock";
import axios from "@/lib/axios";
import { Cart } from "@/interfaces/cart";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { set } from "react-hook-form";

export default function DonationItemCard({ id, stock, quantity }: { id: string; stock: Stock; quantity: number }) {
  const user = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let userCart = user.carts?.find((cart) => cart.placeId === id) as Cart;
  if (!userCart) {
    user.setCarts([...(user.carts ?? []), { placeId: id, donateItems: [] }]);
    userCart = { placeId: id, donateItems: [] } as Cart;
  }
  const addToCart = () => {
    if (user && user.userData?.userType === "donor") {
      const foundItem = userCart.donateItems.find((item) => item.stock?.id === stock.id);
      if (!foundItem) {
        userCart.donateItems.push({
          stock: stock,
          donationAmount: 1
        });
      }

      if (user.carts) {
        let newCarts: Cart[] =
          user.carts.map((cart) => {
            if (cart.placeId === id) {
              return userCart;
            }
            return cart;
          }) ?? [];
        user.setCarts(newCarts);
      }
    }
  };

  const buyItem = () => {
    if (user && user.userData?.userType === "donor") {
      const foundItem = userCart.donateItems.find((item) => item.stock?.id === stock.id);
      if (!foundItem) {
        setIsLoading(true);
        let smallCart = [];
        smallCart.push({
          stock: stock,
          donationAmount: 1
        });
        axios
          .post(`/stripe`, {
            placeId: id,
            items: smallCart
          })
          .then(({ data }) => {
            setIsLoading(false);
            toast({
              title: "Creating a new order."
            });
            window.location.replace(data.data.url);
          })
          .catch((err) => {
            console.error(err);
            setIsLoading(false);
            toast({
              title: "An error occurred.",
              description: err.message
            });
          });
      }
    }
  };

  return (
    <Card className="w-[245px] p-2 space-y-2">
      <CardHeader className="relative h-[220px]">
        <Image src={stock.thumbnail} alt={stock.name} className="object-cover rounded-md" fill={true}></Image>
      </CardHeader>

      <div className="">
        <div className="px-4 py-3 space-y-2">
          <CardTitle className="">{stock.name}</CardTitle>
          <div className="">
            <CardDescription>{quantity} PC.</CardDescription>
            <div className="text-sm font-bold">{stock.price} THB</div>
          </div>
        </div>

        <div className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={stock.price < 10}>
                <FaHeart className="mr-2" />
                Buy Now
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Donate</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>Do you want to donate this item?</AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={buyItem}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={addToCart}>
            <FaShoppingCart className="mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}
