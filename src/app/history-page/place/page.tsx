"use client";

import HistoryHeader from "@/components/history/history-header";
import HistoryReceivedItem from "@/components/history/history-received-item";
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
  
  const [historyReceivedItems, setHistoryReceivedItems] = useState<
    {
      donorName: string;
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
  const [isHistoryReceivedItemsLoadingFinished, setIsHistoryReceivedItemsLoadingFinished] = useState(false);

  useEffect(() => {
    async function getHistoryReceivedItems() {
      if (userData) {
        setIsHistoryReceivedItemsLoadingFinished(false);
        try {
          const res = await axios.get("/history/place");
          const data = res.data.data;
          let tempObject = [];

          for (let i = 0; i < data.length; i++) {
            const findDonor = await axios.get(`/donor/${data[i].donorId}`);
            const donorName = findDonor.data.data.name;
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
              donorName,
              itemList: tempItems,
              totalPrice: data[i].donationAmount,
              status: fixedStatus,
              createdAt: formattedDate,
              isBlessed: data[i].isBlessed,
              id: data[i].id
            };
            tempObject.push(tempTask);
          }
          setHistoryReceivedItems(tempObject);
          setIsHistoryReceivedItemsLoadingFinished(true);
        } catch (err) {
          console.error(err);
          setIsHistoryReceivedItemsLoadingFinished(true);
        }
      }
    }
    getHistoryReceivedItems();
  }, [userData]);

  useEffect(() => {
    // Generate historyItemNodes based on filterOption and historyItems
    console.log(filterOption);
    console.log(historyReceivedItems);
    const historyReceivedItemNodes = historyReceivedItems.map((item) => {
      if (
        (filterOption["All"]) ||
        (!filterOption["Blessed"] && !filterOption["Not Blessed"]) ||
        (filterOption["Blessed"] && item.isBlessed) ||
        (filterOption["Not Blessed"] && !item.isBlessed)
      ) {
        if (filterOption[item.status] || (!filterOption["Pending"] && !filterOption["Paid"] && !filterOption["Delivering"] && !filterOption["Received"])) {
          return (
            <HistoryReceivedItem
              key={item.donorName + item.createdAt}
              donorName={item.donorName}
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
    console.log(historyReceivedItemNodes);
    // Render the generated historyItemNodes
    setHistoryReceivedItemNodes(historyReceivedItemNodes);
  }, [filterOption, historyReceivedItems]);

  const [historyReceivedItemNodes, setHistoryReceivedItemNodes] = useState<React.ReactNode[]>([]);

  if (isLoading || !userData) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <h1 className="text-3xl">Loading...</h1>
      </div>
    );
  } else if (userData.userType === UserType.place) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <MainNav />
        <div className="flex-1">
          <div className="w-full h-96 bg-cover bg-[url('/images/history-received.png')] flex items-center">
            <label className="text-6xl font-semibold text-white ms-8">DONATION RECEIVED HISTORY</label>
          </div>
          <div className="mt-12 py-12 px-20">
            <HistoryHeader
              header={userData.name}
              sortOption={["Name", "Date"]}
              filterOption={filterOption}
              sortSelecting={-1}
              filterStateFunction={setFilterOption}
            />
            <div className="flex flex-col mt-12 gap-6">
              {!isHistoryReceivedItemsLoadingFinished ? (
                <HistoryReceivedItem
                  donorName={"..."}
                  itemList={{}}
                  totalPrice={0}
                  status={"Pending"}
                  createdAt={"..."}
                  isBlessed={false}
                  isLoading={true}
                  id=""
                />
              ) : (
                historyReceivedItemNodes
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (userData.userType === UserType.donor) {
    router.push("/history-page/donor");
  }
  return null;
}
