"use client";
import { Skeleton } from "../ui/skeleton";
import { Stock } from "@/interfaces/stock";
import { StockOperation } from "./stock-operation";

export const StockCard = ({ stock }: { stock: Stock }) => {
  return (
    <div className="inline-block w-[300px] p-2">
      <div className="w-full h-[280px] bg-background rounded-lg shadow-md">
        <div
          className="w-full h-48 bg-cover bg-center rounded-t-lg"
          style={{ backgroundImage: `url(${stock.thumbnail})` }}
        />
        <div className="p-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg text-foreground text-left">{stock.name} ({stock.stock.toLocaleString()} remains)</h3>
            <StockOperation stock={stock} />
          </div>
          <p className="text-sm text-foreground line-clamp-1">{stock.description}</p>
          <p className="text-sm text-muted-foreground">{stock.price.toLocaleString()} Bath</p>
        </div>
      </div>
    </div>
  );
};

StockCard.Skeleton = function StockCardSkeleton() {
  return (
    <div className="inline-block w-[300px] p-2">
      <div className="w-full h-64 bg-foreground rounded-lg shadow-md">
        <Skeleton className="w-full h-48 bg-cover bg-center rounded-t-lg" />
        <div className="p-2">
          <Skeleton className="w-1/2 h-4 mb-2" />
          <Skeleton className="w-3/4 h-3" />
        </div>
      </div>
    </div>
  );
};
