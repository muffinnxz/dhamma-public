"sse client";

import { IoIosCart } from "react-icons/io";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import useUser from "@/hooks/use-user";
import ItemInCart from "./item-in-cart";
import { useEffect } from "react";
import { useState } from "react";
import { RequestItemDisplay } from "@/interfaces/request-item";
import { Separator } from "../ui/separator";
import { Stock } from "@/interfaces/stock";
import axios from "@/lib/axios";
import { Cart } from "@/interfaces/cart";
import { useToast } from "../ui/use-toast";
import { LuLoader } from "react-icons/lu";
import { useCallback } from "react";
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
import { useSearchParams } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";

interface CartIconProps {
  stock: Stock;
  donateAmount: number;
  requestAmount: number;
}

export default function CartIcon({ id, requestItems }: { id: string; requestItems: RequestItemDisplay[] }) {
  const [reqItemArr, setReqItemArr] = useState<CartIconProps[]>([]);
  const [counter, setCounter] = useState(0);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const { carts, setCarts, donationMoneys } = useUser();
  let placeCart = carts?.find((cart) => cart.placeId === id);

  const searchParams = useSearchParams();
  const payment = searchParams?.get("payment");
  const orderId = searchParams?.get("orderId");

  useEffect(() => {
    if (payment === "success" && orderId) {
      toast({
        title: "Payment success.",
        description: `Thank you for your donation. Your order id is ${orderId}`
      });
    } else if (payment === "cancel" && orderId) {
      toast({
        title: "Payment canceled.",
        description: `Your order id is ${orderId}`
      });
    }
  }, [payment, orderId, toast]);

  const calTotal = useCallback( 
    (cart: CartIconProps[]) => {
      let total = 0;
      cart?.forEach((item) => {
        total += (item.stock?.price ?? 0) * item.donateAmount;
      });
      return total + (donationMoneys?.find((donation) => donation.placeId === id)?.amount ?? 0);
    },[donationMoneys, id]);

  const updatePlaceCart = (placeCart: Cart) => {
    let newCarts =
      carts?.map((cart) => {
        if (cart.placeId === id) {
          return placeCart;
        }
        return cart;
      }) ?? [];
    setCarts(newCarts);
  };

  const makeOrder = () => {
    setIsLoading(true);
    if (carts?.find((cart) => cart.placeId === id)?.donateItems.length === 0) {
      setIsLoading(false);
      toast({
        title: "Your cart is empty."
      });
      return;
    }
    axios
      .post(`/stripe`, {
        placeId: id,
        items: carts?.find((cart) => cart.placeId === id)?.donateItems || [],
        donationMoney : donationMoneys?.find((donation) => donation.placeId === id)?.amount || 0
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
  };

  useEffect(() => {
    let newReqItemArr: CartIconProps[] =
      placeCart?.donateItems.map((item) => {
        return {
          stock: item.stock,
          donateAmount: item.donationAmount,
          requestAmount: requestItems.find((reqItem) => reqItem.stock?.id === item.stock?.id)?.amount ?? 0
        };
      }) ?? [];

    setReqItemArr(newReqItemArr);
    setCounter(placeCart?.donateItems.length ?? 0);
    setTotal(calTotal(newReqItemArr));
  }, [calTotal, carts, placeCart?.donateItems, requestItems]);

  return (
    <div className="text-white">
      {counter > 0 && (
        <div className="bg-primary-red rounded-full text-xs relative top-5 left-0 w-5 h-5 flex items-center justify-center animate-bounce">
          <p>{counter}</p>
        </div>
      )}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="bg-primary-dark-blue rounded-full w-17 h-17 p-4 flex justify-center items-center shadow-xl"
          >
            <IoIosCart className="w-7 h-7" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Cart</SheetTitle>
            <SheetDescription>
              
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-5/6 px-3">
          
          {reqItemArr && (
            <div className="">
              {reqItemArr?.map((item: CartIconProps, index: number) => (
                <>
                  <ItemInCart
                    item={item.stock}
                    requestAmount={item.requestAmount}
                    donateAmount={item.donateAmount}
                    id={id}
                  />
                  {/* <Separator className="my-2"></Separator> */}
                  {(index !== reqItemArr.length - 1 || 
                    donationMoneys?.find((donation) => donation.placeId === id)?.amount !== 0 ) && <Separator className="my-2"></Separator>}
                </>
              ))}
            </div>
          )}
          {(donationMoneys?.find((donation) => donation.placeId === id)?.amount !== 0) && <div className="flex justify-between items-end mt-5">
            <p className="text-xl font-semibold">Donation </p>
            <p>{donationMoneys?.find((donation) => donation.placeId === id)?.amount ?? 0} THB</p>
          </div>}
          
          </ScrollArea>
          <SheetFooter className="my-6">
            <SheetClose asChild>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={isLoading || total < 10}>
                    {isLoading && <LuLoader className="animate-spin mr-2 h-4 w-4" />}
                    <p>Checkout : {total} $</p>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Donate</AlertDialogTitle>
                    <AlertDialogDescription>Do you want to donate these items?</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={makeOrder}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
