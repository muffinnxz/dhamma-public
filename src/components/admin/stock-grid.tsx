import { TypographyInlineCode } from "../ui/typography";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { StockCard } from "./stock-card";
import { Stock } from "@/interfaces/stock";

export const StockGrid = ({ isLoading, stocks }: { isLoading: boolean; stocks: Stock[] }) => {
  if (!isLoading && !stocks.length) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[200px]">
        <TypographyInlineCode className="text-foreground text-2xl">No stocks found</TypographyInlineCode>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-full justify-center">
        <div className="grid grid-cols-4 p-4">
          {!isLoading && stocks.map((stock, index) => <StockCard key={index} stock={stock} />)}
          {isLoading && Array.from({ length: 8 }).map((_, index) => <StockCard.Skeleton key={index} />)}
        </div>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};
