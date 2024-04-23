import { ScrollArea } from "@/components/ui/scroll-area";
import { Stock } from "@/interfaces/stock";
import DonationItemCard from "./donation-item-card";
import { SortMethod } from "@/interfaces/request-item";
import { useCallback, useState } from "react";
import { useEffect } from "react";
export default function DonateItemShop({
  id,
  requests,
  sortMethod
}: {
  id: string;
  requests: { stock: Stock; amount: number }[];
  sortMethod: SortMethod;
}) {
  const [requestsItems, setRequestItems] = useState<{ stock: Stock; amount: number }[]>(requests);
  const [seed, setSeed] = useState<number>(0);

  const sortReqByMethod = useCallback(
    (sortMethod: SortMethod) => {
      setSeed(Math.random());
      if (sortMethod === "price") {
        setRequestItems(requestsItems.sort((a, b) => a.stock.price - b.stock.price));
      } else if (sortMethod === "name") {
        setRequestItems(requestsItems.sort((a, b) => a.stock.name.localeCompare(b.stock.name)));
      } else if (sortMethod === "need") {
        setRequestItems(requestsItems.sort((a, b) => b.amount - a.amount));
      } else if (sortMethod === "total-price") {
        setRequestItems(requestsItems.sort((a, b) => b.stock.price * b.amount - a.stock.price * a.amount));
      }
    },
    [requestsItems]
  );

  useEffect(() => {
    if (!requests || requests.length === 0) return;
    if (sortMethod === "price") {
      setRequestItems(requests.sort((a, b) => a.stock.price - b.stock.price));
    } else if (sortMethod === "name") {
      setRequestItems(requests.sort((a, b) => a.stock.name.localeCompare(b.stock.name)));
    } else if (sortMethod === "need") {
      setRequestItems(requests.sort((a, b) => b.amount - a.amount));
    } else if (sortMethod === "total-price") {
      setRequestItems(requests.sort((a, b) => b.stock.price * b.amount - a.stock.price * a.amount));
    }
  }, [requests, sortMethod]);

  useEffect(() => {
    sortReqByMethod(sortMethod);
  }, [sortMethod, sortReqByMethod]);

  return (
    <div key={seed}>
      <ScrollArea className="h-[770px] px-20">
        <div className="flex flex-wrap overflow-scroll gap-5">
          {requestsItems.map((request, idx) => (
            <DonationItemCard key={idx} id={id} stock={request.stock} quantity={request.amount} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
