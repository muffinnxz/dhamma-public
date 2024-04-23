import { TypographyInlineCode } from "../ui/typography";
import { ItemCard } from "./item-card";
import { Stock } from "@/interfaces/stock";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export const ItemGrid = ({
  isLoading,
  needs,
  updateNeeds
}: {
  isLoading: boolean;
  needs: { stock: Stock; amount: number }[];
  updateNeeds: (updatedNeed: { stock: Stock; amount: number }) => void;
}) => {
  if (!isLoading && !needs.length) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[200px]">
        <TypographyInlineCode className="text-foreground text-2xl">No stocks found</TypographyInlineCode>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap h-[500px]">
      <div className="flex w-full justify-center">
        <div className="grid grid-cols-4 p-5 gap-5">
          {!isLoading && needs.map((need, index) => <ItemCard key={index} need={need} updateNeeds={updateNeeds} />)}
        </div>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};
