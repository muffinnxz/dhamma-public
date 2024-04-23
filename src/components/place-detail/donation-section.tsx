import { Stock } from "@/interfaces/stock";
import { LuFilterX } from "react-icons/lu";
import { LuFilter } from "react-icons/lu";
import { SelectSortMethod } from "./select-sort-method";

// var showFilter = true;

import CategoryMenu from "./category-menu";
import DonateItemShop from "./donante-item-shop";
import { useCallback, useEffect, useState } from "react";
import { Category } from "@/interfaces/stock";
import { SortMethod } from "@/interfaces/request-item";

export default function DonationSection({
  id,
  requests,
  isLoading
}: {
  id: string;
  requests: { stock: Stock; amount: number }[];
  isLoading: Boolean;
}) {
  const [category, setCategory] = useState<Category[]>([]);
  const [requestsItems, setRequestItems] = useState<{ stock: Stock; amount: number }[]>([]);
  const [sortMethod, setSortMethod] = useState<SortMethod>(SortMethod.name);
  const [showCategory, setShowCategory] = useState(true);

  const filterReqByCategory = useCallback((categorys: Category[]) => {
    if (categorys.length === 0) {
      setRequestItems(requests);
    } else {
      setRequestItems(requests.filter((request) => categorys.includes(request.stock.category)));
    }
  }, [requests]);

  useEffect(() => {
    filterReqByCategory(category);
  }, [category, filterReqByCategory]);

  return (
    <div className="w-full space-y-5 text-primary-dark-blue">
      <div className="text-5xl font-bold">DONATION ITEMS</div>

      <div className="">
        <div className="flex justify-between px-7 py-3 border-b border-primary-dark-blue border-opacity-20">
          <div className="flex items-center text-xl">
            <button
              onClick={() => {
                setShowCategory(!showCategory);
              }}
            >
              {showCategory && <LuFilter />}
              {!showCategory && <LuFilterX />}
            </button>
            &nbsp; Filter
          </div>
          <div className="flex items-center">
            <SelectSortMethod setSortMethod={setSortMethod} />
          </div>
        </div>

        <div className="flex overflow-hidden">
          <div className={`transition-all ${showCategory ? "w-64 px-12 py-3" : "-ml-20 invisible"}`}>
            <CategoryMenu category={category} setCategory={setCategory}></CategoryMenu>
          </div>
          <div
            className={`transition-all flex-1 border-l py-3 border-primary-dark-blue border-opacity-20 ${
              showCategory ? "" : "border-none"
            }"`}
          >
            <DonateItemShop id={id} requests={requestsItems} sortMethod={sortMethod}></DonateItemShop>
          </div>
        </div>
      </div>
    </div>
  );
}
