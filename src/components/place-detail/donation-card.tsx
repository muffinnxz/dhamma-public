
import { Timestamp } from "firebase-admin/firestore";
import { formatDateJsonToObject } from "@/lib/utils";

export default function DonationCard({createdAt, totalPrice, donorName}: {createdAt: Timestamp, totalPrice: number, donorName: string}) {

    const time = formatDateJsonToObject(createdAt);

    const formatDate = (date:Date) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear().toString();
        return `${day}-${month}-${year}`;
    }


    return (
        <div>
            <p className="text-primary-dark-blue text-sm">{donorName}</p>
            <div className="flex border-b-2 border-primary-light-gray justify-between">
                <p className="text-primary-gray text-lg my-auto">{totalPrice} THB</p>
                <p className="text-primary-light-gray text-sm my-auto">{formatDate(time)}</p>
            </div>
        </div>
    )
}