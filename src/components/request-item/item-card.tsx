import React from "react";
import { useEffect, useState } from "react";
import { Stock } from "@/interfaces/stock";

const QuantityController = ({
  quantity,
  onIncrease,
  onDecrease
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) => (
  <div className="flex flex-col justify-center text-sm font-semibold">
    <button
      onClick={onIncrease}
      className="flex justify-center items-center px-1.5 rounded-3xl aspect-square h-[20px]"
      tabIndex={0}
    >
      +
    </button>
    <div className="text-sm text-center">{quantity}</div>
    <button
      onClick={onDecrease}
      className="flex justify-center items-center px-1.5  rounded-3xl aspect-square h-[20px]"
      tabIndex={0}
    >
      -
    </button>
  </div>
);

export const ItemCard = ({
  need,
  updateNeeds
}: {
  need: { stock: Stock; amount: number };
  updateNeeds: (updatedNeed: { stock: Stock; amount: number }) => void;
}) => {
  const [stockReq, setStockReq] = useState(need);

  useEffect(() => {
    setStockReq(need);
  }, [need]);

  const handleIncrease = () => {
    const updatedNeed = { ...stockReq, amount: stockReq.amount + 1 };
    setStockReq(updatedNeed);
    updateNeeds(updatedNeed);
  };

  const handleDecrease = () => {
    if (stockReq.amount === 0) return;
    const updatedNeed = { ...stockReq, amount: stockReq.amount - 1 };
    setStockReq(updatedNeed);
    updateNeeds(updatedNeed);
  };

  return (
    <div className="flex flex-col w-[200px] h-[225px] bg-background rounded-lg shadow-md">
      <div
        className="w-full h-36 bg-cover bg-center rounded-t-lg"
        style={{ backgroundImage: `url(${stockReq.stock.thumbnail})` }}
      />
      <div className="p-2 bg-violet-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground text-left">{stockReq.stock.name}</h3>
            <p className="text-sm text-foreground line-clamp-1 text-wrap">{stockReq.stock.description}</p>
            <p className="text-sm text-muted-foreground">{stockReq.stock.price.toLocaleString()} Bath</p>
          </div>
          <QuantityController
            quantity={stockReq.amount}
            onIncrease={() => handleIncrease()}
            onDecrease={() => handleDecrease()}
          />
        </div>
      </div>
    </div>
  );
};
