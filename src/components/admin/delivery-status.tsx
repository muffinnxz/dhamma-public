export default function DeliveryStatus({
  donorName,
  placeName,
  statusOption,
  itemList,
  totalPrice,
  statusSelecting,
  createdAt,
  isLoading,
  onStatusChange,
  orderIndex,
}: {
  donorName: string;
  placeName: string;
  statusOption: string[];
  itemList: {
    [key: string]: number;
  };
  totalPrice?: number;
  statusSelecting: number;
  createdAt: string;
  isLoading: boolean;
  onStatusChange: (newStatus: string) => void;
  orderIndex: number;
}) {
  if (isLoading) {
    return (
      <div className="w-full h-60 bg-slate-50 flex justify-center items-center">
        <h3>Loading...</h3>
      </div>
    );
  } else {
    let itemListNodes: React.ReactNode[] = [];
    let count = 0;
    let limit = 3;
    for (const [key, value] of Object.entries(itemList)) {
      if (count < limit) {
        itemListNodes.push(
          <li key={key} className="w-24 truncate">
            {value} {key}
          </li>
        );
      }
      count++;
    }
    
    const status = statusOption.map((opt, index) => {
      return (
        <option disabled={index < statusSelecting} key={opt} value={opt} className="text-center" selected={statusSelecting === index}>
          {opt}
        </option>
      );
    });

    let statusColor =
      statusSelecting == 0
        ? " bg-slate-500 "
        : statusSelecting == 1
        ? " bg-orange-500 "
        : statusSelecting == 2
        ? " bg-blue-500 "
        : " bg-green-600 ";

    let bgColor = (orderIndex % 2 == 0) ? " bg-white " : " bg-white "

    return (
      <div className={"w-full h-60 p-12 rounded-lg duration-200 drop-shadow-sm hover:drop-shadow-lg flex items-center justify-between overflow-hidden " + bgColor}>
        <div className="flex flex-col items-start w-full h-full justify-between">
          <div className="flex justify-between items-start w-full">
            <div className="relative h-full flex justify-center items-center">
              <h3 className="text-3xl max-w-60 truncate">{donorName}</h3>
              <div className="px-4">
                <h3 className="text-1xl max-w-60 my-6">Donate to</h3>
              </div>
              <h3 className="text-3xl max-w-60 truncate">{placeName}</h3>
            </div>
            <div className="flex flex-col items-end justify-center h-full">
              <select
                className={"border-2 border-slate-500 relative rounded-md text-center pl-4 pr-3 duration-200 hover:text-slate-900 hover:border-slate-700 text-white py-1 " + ((statusSelecting === 0) ? " bg-slate-500 hover:bg-slate-100 " : (statusSelecting === 1) ? " bg-orange-500 hover:bg-orange-200 " : (statusSelecting === 2) ? " bg-blue-500 hover:bg-blue-200 " : " bg-green-500 hover:bg-green-200 ")}
                onChange={(e) => onStatusChange(e.target.value)}
              >
                {status}
              </select>
              <h4 className="text-xs mt-2 ml-2">Donated at {createdAt.replace(" GMT+0700 (Indochina Time)", "")}</h4>
            </div>
          </div>
          <div className="overflow-hidden flex">
            <ul className="truncate h-24">
              {itemListNodes}
              {count > limit ? <li className="mt-[-12px] text-2xl">...</li> : null}
            </ul>
            <ul className="">
              <li>{typeof totalPrice === "number" ? `${totalPrice} Baht` : null}</li>
            </ul>
          </div>
        </div>
      </div>
    );
    
  }
}
