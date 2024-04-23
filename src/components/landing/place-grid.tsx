import { TypographyLarge } from "../ui/typography";
import { PlaceCard } from "./place-card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Place } from "@/interfaces/place";

export const PlaceGrid = ({ isLoading, places }: { isLoading: boolean; places: Place[] }) => {
  if (!isLoading && !places.length) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[200px]">
        <TypographyLarge className="text-foreground text-2xl">No places found</TypographyLarge>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-full justify-center">
        <div className="grid grid-cols-3 w-[1260px] ">
          {!isLoading && places.map((place, index) => <PlaceCard key={index} place={place} />)}
          {isLoading && Array.from({ length: 5 }).map((_, index) => <PlaceCard.Skeleton key={index} />)}
        </div>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};
