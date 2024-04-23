"use client";

import BlessingBanner from "@/components/blessing-task/blessing-banner"
import BlessingHeader from "@/components/blessing-task/blessing-header"
import BlessingItem from "@/components/blessing-task/blessing-item"
import HomeLayout from "@/components/layouts/home-layout";

import useUser from "@/hooks/use-user";
import { UserType } from "@/interfaces/user";
import { useState, useEffect } from "react";
import { useRouter } from "@/lib/router-events";
import { Stock } from "@/interfaces/stock";
import axios from "@/lib/axios";

export default function BlessingTaskPage() {
  const router = useRouter();
  const { isLoading, userData } = useUser();
  const [filterOption, setFilterOption] = useState<{
    [key: string]: boolean;
  }>({
    All: true,
    Blessed: false,
    "Not Blessed": false
  });
  
  const [blessingItems, setBlessingItems] = useState<
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
  const [isBlessingItemsLoadingFinished, setIsBlessingItemsLoadingFinished] = useState(false);
  
  // make sure that only one item is uploading at the moment
  // for now...
  // this might not be the best, but it makes the job done
  const [isSomeoneUploading, setIsSomeoneUploading] = useState(false);

  useEffect(() => {
    async function getBlessingItems() {
      if (userData) {
        setIsBlessingItemsLoadingFinished(false);
        try {
          const res = await axios.get("/history/place");
          const data = res.data.data;
          console.log(data);
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
          setBlessingItems(tempObject);
          setIsBlessingItemsLoadingFinished(true);
        } catch (err) {
          console.error(err);
          setIsBlessingItemsLoadingFinished(true);
        }
      }
    }
    getBlessingItems();
  }, [userData]);

  useEffect(() => {
    // Generate historyItemNodes based on filterOption and historyItems
    const tempArray = blessingItems.map((item) => {
      if (
        (filterOption["All"]) ||
        (!filterOption["Blessed"] && !filterOption["Not Blessed"]) ||
        (filterOption["Blessed"] && item.isBlessed) ||
        (filterOption["Not Blessed"] && !item.isBlessed)
      ) {
        if (filterOption[item.status] || (!filterOption["Pending"] && !filterOption["Paid"] && !filterOption["Delivering"] && !filterOption["Received"])) {
          return (
            <BlessingItem
              key={item.donorName + item.createdAt}
              donorName={item.donorName}
              itemList={item.itemList}
              totalPrice={item.totalPrice}
              status={item.status}
              createdAt={item.createdAt}
              isBlessed={item.isBlessed}
              isLoading={false}
              isSomeoneUploading={isSomeoneUploading}
              setIsSomeoneUploading={setIsSomeoneUploading}
              id={item.id}
            />
          );
        }
      }
      return null;
    });
    // Render the generated blessingItemNodes
    setBlessingItemNodes(tempArray);
  }, [filterOption, blessingItems, isSomeoneUploading]);

  const [blessingItemNodes, setBlessingItemNodes] = useState<React.ReactNode[]>([]);

  if (isLoading || !userData) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <h1 className="text-3xl">Loading...</h1>
      </div>
    );
  } else if (userData.userType === UserType.place) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <HomeLayout>
          <div className="flex-1">
            <BlessingBanner/>
            <div className="mt-12 py-12 px-20">
              <BlessingHeader
                header={userData.name}
                sortOption={["Name", "Date"]}
                filterOption={filterOption}
                sortSelecting={-1}
                filterStateFunction={setFilterOption}
              />
              <div className="flex flex-col mt-12 gap-6">
                {!isBlessingItemsLoadingFinished ? (
                  <BlessingItem
                    donorName={"..."}
                    itemList={{}}
                    totalPrice={0}
                    status={"Pending"}
                    createdAt={"..."}
                    isBlessed={false}
                    isLoading={true}
                    isSomeoneUploading={false}
                    setIsSomeoneUploading={() => {}}
                    id=""
                  />
                ) : (
                  blessingItemNodes
                )}
              </div>
            </div>
          </div>
        </HomeLayout>
      </div>
    );
  } else if (userData.userType === UserType.donor) {
    router.push("/history-page/donor");
  }
  return null;
}
