"use client";

import { AddStockButton } from "@/components/admin/add-stock-button";
import { StockGrid } from "@/components/admin/stock-grid";
import HomeLayout from "@/components/layouts/home-layout";
import { Input } from "@/components/ui/input";
import { TypographyH2, TypographyLarge } from "@/components/ui/typography";
import useUser from "@/hooks/use-user";
import { Stock } from "@/interfaces/stock";
import axios from "@/lib/axios";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const { user } = useUser();

  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    loadStocks();
  }, [user]);

  const loadStocks = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("/stocks");
      setStocks(res.data.data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const displayedStock = useMemo(() => {
    if (!searchTerm) return stocks;
    return stocks.filter((stock) => stock.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [stocks, searchTerm]);

  return (
    <HomeLayout>
      <div
        className="relative flex w-full h-[300px] bg-cover bg-no-repeat bg-blend-overlay"
        style={{
          backgroundImage: `url(https://static.cdntap.com/tap-assets-prod/wp-content/uploads/sites/25/2021/10/the-end-of-the-Buddhist-Lent.jpg)`
        }}
      >
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50"></div>
        <div className="container h-full z-10">
          <div className="flex flex-1 h-full items-center">
            <div className="flex flex-col justify-center">
              <TypographyH2 className="text-white text-7xl">STOCK MANAGEMENT</TypographyH2>
              <TypographyLarge className="text-white">ADMIN</TypographyLarge>
            </div>
          </div>
          <div className="flex flex-1"></div>
        </div>
      </div>
      <div className="container px-20 mt-8">
        <div className="flex justify-between w-full gap-4">
          <div className="flex gap-2 items-center w-full">
            <Search size={24} />
            <Input className="w-full" placeholder="search your stock..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}  />
          </div>
          <AddStockButton loadStocks={loadStocks} />
        </div>
        <StockGrid isLoading={isLoading} stocks={displayedStock} />
      </div>
    </HomeLayout>
  );
}
