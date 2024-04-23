"use client";

import { Place } from "@/interfaces/place";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import { useRouter } from "@/lib/router-events";
import { useEffect } from "react";
import axios from "@/lib/axios";
import { useState } from "react";
import { Stock } from "@/interfaces/stock";

export const PlaceCard = ({ place }: { place: Place }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [requestItems, setRequestItems] = useState<{ stock: Stock; amount: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/request-item/${place.id}`);
        setRequestItems(res.data.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [place]);


  if (!isLoading) {
    return (
      <div className="inline-block w-[400px] p-2">
        <div className="w-[400px] h-[500px] bg-[#FFF5EB] rounded-lg">
          <div
            className="w-[400px] h-[300px] bg-cover bg-center rounded-t-lg"
            style={{ backgroundImage: `url(${place.picture}`}}
          />
          <div className="flex flex-col w-[400px] h-[200px] pl-[20px] gap-[5px] justify-center">
            <p className="text-sm text-yellow-500">{place.province.toUpperCase()}</p>
            <TypographyH3>{place.name.toUpperCase()}</TypographyH3>
            { requestItems.length > 0 && (
              requestItems.slice(0,Math.min(3,requestItems.length)).map((item) => item.stock.name.toUpperCase()).join(", ") + (requestItems.length > 3 ? ", ..." : "")
            )}
            { requestItems.length === 0 && (
              <div>&nbsp;</div>
            )}
            <Button variant="donate" className="w-[140px]" onClick={() => router.push(`/place/${place.id}`)}>DONATE NOW</Button>
          </div>
        </div>
      </div>
    );
  }
};

PlaceCard.Skeleton = function PlaceCardSkeleton() {
  return (
    <div className="inline-block w-[400px] p-2">
      <div className="w-[400px] h-[550px] bg-background rounded-lg">
        <Skeleton className="w-[400px] h-[300px] bg-cover bg-center rounded-t-lg" />
        <div className="p-2">
          <Skeleton className="w-1/2 h-4 mb-2" />
          <Skeleton className="w-3/4 h-3" />
        </div>
      </div>
    </div>
  );
};
