"use client";
import useUser from "@/hooks/use-user";
import { Stock } from "@/interfaces/stock";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { DonationDashboard } from "@/components/request-item/donation-dashboard";
import { ItemGrid } from "@/components/request-item/item-grid";
import { ImageBanner } from "@/components/request-item/banner";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { MainNav } from "@/components/layouts/main-nav";
import { SiteFooter } from "@/components/layouts/site-footer";
import { RequestItemDisplay } from "@/interfaces/request-item";
import { LuSearch } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { RequestMoney } from "@/components/request-item/money-section";

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useUser();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [needs, setNeeds] = useState<{ stock: Stock; amount: number }[]>([]);
  const [recentRequestMoney, setRecentRequestMoney] = useState<number>(0);
  const [newRequestMoney, setNewRequestMoney] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredneeds, setFilteredNeeds] = useState<{ stock: Stock; amount: number }[]>([]);
  const [showPopUp, setShowPopUp] = useState<{ isShow: boolean; state: string }>({ isShow: false, state: "" });

  useEffect(() => {
    if (showPopUp) {
      const timer = setTimeout(() => {
        setShowPopUp({ ...showPopUp, isShow: false });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showPopUp]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredNeeds(needs);
      return;
    }
    setFilteredNeeds(
      needs.filter((need) => {
        return need.stock.name.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, needs]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/stocks");
        setStocks(res.data.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("request-item");
        const needs = stocks.map((stock) => {
          const prev = res.data.data.requestItems.find(
            (need: RequestItemDisplay) => need.stock && need.stock.id === stock.id
          );
          return {
            stock: stock,
            amount: prev ? prev.amount : 0
          };
        });
        const recentRequestMoney = res.data.data.requestMoney;
        setRecentRequestMoney(recentRequestMoney ?? 0);
        setNeeds(needs);
        setFilteredNeeds(needs);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    if (user && stocks) {
      fetchData();
    }
  }, [stocks, user]);

  const onIncrement = (amount: number) => {
    setNewRequestMoney((prevValue) => prevValue + amount);
  };

  const updateNeeds = (updatedNeed: { stock: Stock; amount: number }) => {
    setNeeds(needs.map((need) => (need.stock.id === updatedNeed.stock.id ? updatedNeed : need)));
  };

  const handleSave = async () => {
    setIsLoading(true);
    axios
      .put("request-item", { requestList: needs, requestMoney: newRequestMoney })
      .then(() => {
        setNeeds(needs);
        if (isNaN(newRequestMoney)) {
          setNewRequestMoney(0);
        } else {
          setRecentRequestMoney(newRequestMoney);
        }
        setIsLoading(false);
        setShowPopUp({ isShow: true, state: "save" });
      })
      .catch((err) => {
        setIsLoading(false);
        toast({
          title: "An error occurred.",
          description: err.message
        });
      });
  };

  const handleDisable = async () => {
    setIsLoading(true);
    axios
      .delete("request-item")
      .then(() => {
        setNeeds(needs.map((need) => ({ stock: need.stock, amount: 0 })));
        setShowPopUp({ isShow: true, state: "disable" });
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast({
          title: "An error occurred.",
          description: err.message
        });
      });
  };

  return (
    <div className="bg-primary-light-yellow w-[1440px]">
      <MainNav />
      <ImageBanner />
      <div className="flex justify-evenly m-[50px]">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-5">
            <LuSearch className="w-8 h-8" />
            <Input
              placeholder="Search for items..."
              className="w-[600px] h-[50px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ItemGrid
            isLoading={isLoading}
            needs={filteredneeds}
            updateNeeds={(updateNeed: { stock: Stock; amount: number }) => updateNeeds(updateNeed)}
          />
          <RequestMoney
            recentRequestMoney={recentRequestMoney}
            newRequestMoney={newRequestMoney ?? 0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRequestMoney(parseInt(e.target.value))}
            onIncrement={(amount: number) => onIncrement(amount)}
          />
          <div className="flex gap-5 justify-between">
            <Button
              className="bg-[#fc9284] text-black font-semibold"
              type="submit"
              disabled={isLoading}
              onClick={handleDisable}
            >
              DISABLE REQUEST
            </Button>
            <Button
              className="bg-[#fcd384] text-black font-semibold"
              type="submit"
              disabled={isLoading}
              onClick={handleSave}
            >
              SAVE
            </Button>
          </div>
        </div>
        <DonationDashboard />
      </div>
      <SiteFooter />
      {showPopUp.isShow ? (
        <div className="fixed bottom-10 right-10 bg-white p-4 rounded-lg shadow-lg">
          <p>{showPopUp.state === "save" ? "Save successful!" : "Disable request successful!"}</p>
        </div>
      ) : null}
    </div>
  );
}
