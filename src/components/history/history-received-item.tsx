import Link from "next/link";

export default function HistoryReceivedItem({
  donorName,
  itemList,
  totalPrice,
  status,
  createdAt,
  isBlessed,
  isLoading,
  id,
}: {
  donorName: string;
  itemList: {
    [key: string]: number;
  };
  totalPrice?: number;
  status: string;
  createdAt: string;
  isBlessed: boolean;
  isLoading: boolean;
  id: string;
}) {
  if (isLoading) {
    return (
      <div className="w-full g-60 flex items-center justify-center duration-200 hover:drop-shadow">
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

    let statusColor =
      status === "Pending" ? " bg-slate-500 " : status === "Paid" ? " bg-orange-500 " : status === "Delivering" ? " bg-blue-500 " : " bg-green-600 ";

    return (
      <div className="w-full h-60 p-12 rounded-lg bg-white duration-200 hover:drop-shadow flex items-center justify-between overflow-hidden">
        <div className="flex">
          <div className="relative h-full">
            <h3 className="text-4xl min-w-48 max-w-60 truncate">{donorName}</h3>
            <div className="mt-3 flex">
              {itemListNodes.length > 0 ? (
                <>
                  <ul className="truncate h-24">
                    {itemListNodes}
                    {count > limit ? <li className="mt-[-12px] text-2xl">...</li> : null}
                  </ul>
                  <ul className="ml-5">
                    <li>{typeof totalPrice === "number" ? `${totalPrice} Baht` : null}</li>
                  </ul>
                </>
              ) : (
                <ul>
                  <li>{typeof totalPrice === "number" ? `${totalPrice} Baht` : null}</li>
                </ul>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-start items-center ml-6">
            <h3 className={"w-48 py-2 text-white text-center rounded-md h-min " + statusColor}>{status}</h3>
            <h4 className="text-xs mt-2">Donated at {createdAt}</h4>
          </div>
          <div>
            {isBlessed ? (
              <h3 className="w-48 ml-4 py-2 text-center text-white bg-green-600 rounded-md">Blessed</h3>
            ) : (
              <h3 className="w-48 ml-4 py-2 text-center text-white bg-slate-500 rounded-md">Unblessed</h3>
            )}
          </div>
        </div>
        {isBlessed ? (
          <div className="h-full flex items-center">
            <Link href={`/video-blessed/${id}`} target="_blank" className="px-4 py-2 bg-green-800 text-white rounded-md duration-200 hover:drop-shadow-md">
              Watch Blessing Video
            </Link>
          </div>
        ) : null}
      </div>
    );
  }
}
