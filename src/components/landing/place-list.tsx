import { TypographyInlineCode } from "../ui/typography";
import { PlaceCard } from "./place-card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Place } from "@/interfaces/place";
//May not need to use this file anymore because it has been replaced with place-recommend.tsx (not sure)

export const PlaceList = ({ isLoading, places }: { isLoading: boolean; places: Place[] }) => {
  if (!isLoading && !places.length) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[200px]">
        <TypographyInlineCode className="text-foreground text-2xl">No places found</TypographyInlineCode>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max overflow-hidden space-x-4 p-4 ">
        {!isLoading && places.map((place, index) => <PlaceCard key={index} place={place} />)}
        {isLoading && Array.from({ length: 5 }).map((_, index) => <PlaceCard.Skeleton key={index} />)}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
