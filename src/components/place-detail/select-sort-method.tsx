"use client";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { SortMethod } from "@/interfaces/request-item";

export function SelectSortMethod({ setSortMethod }: { setSortMethod: Function }) {
  const click = (method: SortMethod) => {
    setSortMethod(method);
  };
  return (
    <Select onValueChange={click}>
      <SelectTrigger className="w-max bg-transparent border-transparent text-lg text-center">
        Sort by&nbsp;
        <SelectValue placeholder="name" className="" />
        &nbsp;&nbsp;
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="flex flex-col">
          {Object.values(SortMethod).map((method) => (
            <button key={method}>
              <SelectItem value={method}>{method}</SelectItem>
            </button>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
