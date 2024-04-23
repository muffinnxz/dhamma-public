"use client";

import HistoryHeader from "@/components/history/history-header";
import HistoryItem from "@/components/history/history-item";
import { MainNav } from "@/components/layouts/main-nav";
import useUser from "@/hooks/use-user";
import { UserType } from "@/interfaces/user";
import { useState, useEffect } from "react";
import { useRouter } from "@/lib/router-events";
import { Stock } from "@/interfaces/stock";
import axios from "@/lib/axios";

export default function History() {
  const router = useRouter();
  const { isLoading, userData } = useUser();
  const [filterOption, setFilterOption] = useState<{
    [key: string]: boolean;
  }>({
    All: true,
    Pending: false,
    Paid: false,
    Delivering: false,
    Received: false,
    Blessed: false,
    "Not Blessed": false
  });
  
  const [historyItems, setHistoryItems] = useState<
    {
      placeName: string;
      itemList: {
        [key: string]: number;
      };
      totalPrice?: number;
      status: string;
      createdAt: string;
      isBlessed: boolean;
      id: string;
    }[]
    >([]);
  const [isHistoryItemsLoadingFinished, setIsHistoryItemsLoadingFinished] = useState(false);
  const [historyItemNodes, setHistoryItemNodes] = useState<React.ReactNode[]>([]);
    
  useEffect(() => {
    async function getHistoryItems() {
      if (userData) {
        setIsHistoryItemsLoadingFinished(false);
        try {
          const res = await axios.get("/history/donor");
          const data = res.data.data;
          let tempObject = [];

          for (let i = 0; i < data.length; i++) {
            const findPlace = await axios.get(`/place/${data[i].placeId}`);
            const placeName = findPlace.data.data.name;
            let tempItems: {
              [key: string]: number;
            } = {};
            for (let j = 0; j < data[i].itemList.length; j++) {
              const stockRes = await axios.get(`/stocks/${data[i].itemList[j].id}`);
              const stock : Stock = stockRes.data.data;
              tempItems[stock.name] = data[i].itemList[j].amount;
            }
            let fixedStatus = {
              pending: "Pending",
              paid: "Paid",
              delivering: "Delivering",
              received: "Received"
            }[data[i].status.toLowerCase() as 'pending' | 'paid' | 'delivering' | 'received'] || "?????";
            var date = new Date(parseInt(data[i].createdAt._seconds, 10) * 1000);
            var formattedDate = date.toLocaleString();
            let tempTask = {
              placeName,
              itemList: tempItems,
              totalPrice: data[i].donationAmount,
              status: fixedStatus,
              createdAt: formattedDate,
              isBlessed: data[i].isBlessed,
              id: data[i].id
            };
            tempObject.push(tempTask);
          }
          setHistoryItems(tempObject);
          setIsHistoryItemsLoadingFinished(true);
        } catch (err) {
          console.error(err);
          setIsHistoryItemsLoadingFinished(true);
        }
      }
    }
    getHistoryItems();
  }, [userData]);

  useEffect(() => {
    // Generate historyItemNodes based on filterOption and historyItems
    console.log(filterOption);
    console.log(historyItems);
    const historyItemNodes = historyItems.map((item) => {
      if (
        (filterOption["All"]) ||
        (!filterOption["Blessed"] && !filterOption["Not Blessed"]) ||
        (filterOption["Blessed"] && item.isBlessed) ||
        (filterOption["Not Blessed"] && !item.isBlessed)
      ) {
        if (filterOption[item.status] || (!filterOption["Pending"] && !filterOption["Paid"] && !filterOption["Delivering"] && !filterOption["Received"])) {
          return (
            <HistoryItem
              key={item.placeName + item.createdAt}
              placeName={item.placeName}
              itemList={item.itemList}
              totalPrice={item.totalPrice}
              status={item.status}
              createdAt={item.createdAt}
              isBlessed={item.isBlessed}
              isLoading={false}
              id={item.id}
            />
          );
        }
      }
      return null;
    });
    console.log(historyItemNodes);
    // Render the generated historyItemNodes
    setHistoryItemNodes(historyItemNodes);
  }, [filterOption, historyItems]);


  if (isLoading || !userData) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <h1 className="text-3xl">Loading...</h1>
      </div>
    );
  } else if (userData.userType === UserType.donor) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <MainNav />
        <div className="flex-1">
          <div className="w-full h-96 bg-cover bg-[url('/images/his_don_ban.png')] flex items-center">
            <label className="text-6xl font-semibold text-white ms-8">DONATION HISTORY</label>
          </div>
          <div className="mt-12 py-12 px-20">
            <HistoryHeader
              header={userData.name}
              filterOption={filterOption}
              filterStateFunction={setFilterOption}
            />
            <div className="flex flex-col mt-12 gap-6">
              {!isHistoryItemsLoadingFinished ? (
                <HistoryItem
                  placeName={"..."}
                  itemList={{}}
                  totalPrice={0}
                  status={"Pending"}
                  createdAt={"..."}
                  isBlessed={false}
                  isLoading={true}
                  id=""
                />
              ) : (
                historyItemNodes
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (userData.userType === UserType.place) {
    router.push("/history-page/place");
  }
  return null;
}
