import React from "react";

export const RequestMoney = ({
  recentRequestMoney,
  newRequestMoney,
  onChange,
  onIncrement
}: {
  recentRequestMoney: number;
  newRequestMoney: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onIncrement: (amount: number) => void;
}) => {
  return (
    <div className="w-full flex flex-col gap-4  m-6 p-6">
      <span className="text-[22px] font-medium">Recent Request Money: {recentRequestMoney} Bath</span>
      <span className="text-[22px] font-medium">Enter amount of money needed:</span>
      <div className="flex gap-4">
        <button
          onClick={() => onIncrement(100)}
          className="bg-primary-dark-blue text-white w-24 h-10 text-center border border-gray-300 rounded-2xl"
        >
          +100
        </button>
        <button
          onClick={() => onIncrement(1000)}
          className="bg-primary-dark-blue text-white w-24 h-10 text-center border border-gray-300 rounded-2xl"
        >
          +1000
        </button>
        <button
          onClick={() => onIncrement(10000)}
          className="bg-primary-dark-blue text-white w-24 h-10 text-center border border-gray-300 rounded-2xl"
        >
          +10000
        </button>
        <button
          onClick={() => onIncrement(50000)}
          className="bg-primary-dark-blue text-white w-24 h-10 text-center border border-gray-300 rounded-2xl"
        >
          +50000
        </button>
        <span className="text-xl font-medium">
          <input
            placeholder="400..."
            className="bg-white w-24 h-10 text-center border border-gray-300 rounded-2xl mr-2 pl-3"
            type="number"
            required
            min="0"
            value={newRequestMoney}
            onChange={onChange}
          />
          Bath
        </span>
      </div>
    </div>
  );
};
