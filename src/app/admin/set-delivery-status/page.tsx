"use client";

import DeliveryStatusHeader from "@/components/admin/delivery-status-header";
import DeliveryStatus from "@/components/admin/delivery-status";
import { MainNav } from "@/components/layouts/main-nav";
import useUser from "@/hooks/use-user";
import { useState, useEffect, use } from "react";
import axios from "@/lib/axios";
import { Order, OrderStatus } from "@/interfaces/order";
import { Stock } from "@/interfaces/stock";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function SetDeliveryStatus() {
  const { isLoading, setIsLoading, userData } = useUser();
  const [filterOption, setFilterOption] = useState<{
    [key: string]: boolean;
  }>({
    All: true,
    Pending: false,
    Paid: false,
    Delivering: false,
    Received: false
  });

  // initialize with an empty string
  const [deliveryItems, setHistoryItems] = useState<
    {
      id: string;
      donorName: string;
      placeName: string;
      itemList: {
        [key: string]: number;
      };
      totalPrice?: number;
      status: string;
      createdAt: string;
    }[]
  >([]);

  // this variable states whether <HistoryItem /> loading is finished or not
  // if this variable is false (means loading history items), the loading item is displayed
  // if this variable is true (finished loading), the actual items is displayed.
  const [isOrderStatusItemsLoadingFinished, setIsOrderStatusItemsLoadingFinished] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);

  useEffect(() => {
    if (showPopUp) {
      const timer = setTimeout(() => {
        setShowPopUp(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showPopUp]);

  const handleStatusChange = async (newStatus: string, orderId: string) => {
    const newDeliveryItems = deliveryItems.map((item) => {
      if (item.id === orderId) {
        return {
          ...item,
          status: newStatus
        };
      }
      return item;
    });
    setHistoryItems(newDeliveryItems);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const orderDisplays = deliveryItems.map((item) => {
      return {
        id: item.id,
        status: item.status as OrderStatus
      };
    });
    axios
      .put("/history", { orderDisplays: orderDisplays })
      .then(() => {
        setIsLoading(false);
        setShowPopUp(true);
      })
      .catch((err) => {
        setIsLoading(false);
        toast({
          title: "An error occurred.",
          description: err.message
        });
      });
  };

  useEffect(() => {
    async function getOrderStatusItems() {
      if (userData) {
        setIsOrderStatusItemsLoadingFinished(false);
        try {
          const res = await axios.get("/history");
          const data = res.data.data;
          let tempObject = [];

          for (let i = 0; i < data.length; i++) {
            const findPlace = await axios.get(`/place/${data[i].placeId}`);
            const placeName = findPlace.data.data.name;
            const findDonor = await axios.get(`/donor/${data[i].donorId}`);
            const donorName = findDonor.data.data.name;
            let tempItems: {
              [key: string]: number;
            } = {};
            for (let j = 0; j < data[i].itemList.length; j++) {
              const stockRes = await axios.get(`/stocks/${data[i].itemList[j].id}`);
              const stock: Stock = stockRes.data.data;
              tempItems[stock.name] = data[i].itemList[j].amount;
            }
            let fixedStatus =
              {
                pending: "Pending",
                paid: "Paid",
                delivering: "Delivering",
                received: "Received"
              }[data[i].status.toLowerCase() as "pending" | "paid" | "delivering" | "received"] || "?????";
            var date = new Date(parseInt(data[i].createdAt._seconds, 10));
            let tempTask = {
              id: data[i].id,
              donorName,
              placeName,
              itemList: tempItems,
              totalPrice: data[i].donationAmount,
              status: fixedStatus,
              createdAt: date.toString()
            };
            tempObject.push(tempTask);
          }
          setHistoryItems(tempObject);
          setIsOrderStatusItemsLoadingFinished(true);
        } catch (err) {
          console.error(err);
          setIsOrderStatusItemsLoadingFinished(true);
        }
      }
    }
    getOrderStatusItems();
  }, [userData]);

  if (isLoading || !userData) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <h1 className="text-3xl">Loading...</h1>
      </div>
    );
  } else {
    const TaskItemNodes: React.ReactNode[] = deliveryItems.map((item, orderIndex) => {
      if (!filterOption["All"]) {
        if (!filterOption[item.status]) {
          return null;
        } else {
          return (
            <DeliveryStatus
              key={item.id}
              donorName={item.donorName}
              placeName={item.placeName}
              statusOption={["Pending", "Paid", "Delivering", "Received"]}
              itemList={item.itemList}
              totalPrice={item.totalPrice}
              statusSelecting={
                item.status == "Pending" ? 0 : item.status == "Paid" ? 1 : item.status == "Delivering" ? 2 : 3
              }
              createdAt={item.createdAt}
              isLoading={false}
              onStatusChange={(newStatus: string) => handleStatusChange(newStatus, item.id)}
              orderIndex={orderIndex}
            />
          );
        }
      } else {
        return (
          <DeliveryStatus
            key={item.id}
            donorName={item.donorName}
            placeName={item.placeName}
            statusOption={["Pending", "Paid", "Delivering", "Received"]}
            itemList={item.itemList}
            totalPrice={item.totalPrice}
            statusSelecting={
              item.status == "Pending" ? 0 : item.status == "Paid" ? 1 : item.status == "Delivering" ? 2 : 3
            }
            createdAt={item.createdAt}
            isLoading={false}
            onStatusChange={(newStatus: string) => handleStatusChange(newStatus, item.id)}
            orderIndex={orderIndex}
          />
        );
      }
    });

    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <MainNav />
        <div className="flex-1">
          <div className="w-full h-96 bg-cover bg-[url('/images/delivery_status.png')] flex items-center">
            <label className="text-6xl font-semibold text-white ms-8">DELIVERY STATUS</label>
          </div>
          <div className="mt-12 py-12 pl-20 pr-36">
            <DeliveryStatusHeader
              header={userData.name}
              filterOption={filterOption}
              filterStateFunction={setFilterOption}
            />
            {/* 
                            Container that contains a list of TaskItems 
                            if `isTaskItemsLoadingFinished` is false, the loading item is displayed
                        */}
            <div className="flex flex-col mt-12 gap-6">
              {!isOrderStatusItemsLoadingFinished ? (
                <DeliveryStatus
                  donorName={"..."}
                  placeName={"..."}
                  statusOption={["Pending", "Paid", "Delivering", "Received"]}
                  itemList={{}}
                  totalPrice={0}
                  statusSelecting={0}
                  createdAt={"..."}
                  isLoading={true}
                  onStatusChange={() => {}}
                  orderIndex={0}
                />
              ) : (
                TaskItemNodes
              )}
            </div>
          </div>
          <Button className="fixed bottom-4 right-4" onClick={handleSave}>
            Save Status
          </Button>
          {showPopUp ? (
            <div className="fixed bottom-10 right-10 bg-white p-4 rounded-lg shadow-lg">
              <p>Save successful!</p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
  return null;
}
