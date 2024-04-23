import Image from 'next/image';
import { FaPrayingHands } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { UserData } from "@/interfaces/user";

export default function InfoSection({ placeData }: { placeData: UserData }) {
    return (
        <div className="space-y-10 text-primary-dark-blue">
            <div className='relative w-[800px] h-[400px] rounded-lg shadow-lg'>
                <Image
                    src={placeData?.picture || ""}
                    alt={placeData?.name || ""}
                    fill={true}
                    className="rounded-lg object-cover"
                ></Image>
            </div>
            <div className="space-y-10">
                <div className="font-bold text-5xl">
                    {placeData?.name.toUpperCase()}
                </div>
                <div className="text-xl px-5 space-y-5">
                    <div className="flex gap-5">
                        <FaLocationDot size={30} />
                        <p>{`${placeData?.placeLocation?.toUpperCase()}, ${placeData?.province?.toUpperCase()}, ${placeData?.postalCode?.toUpperCase()}`}</p>
                    </div>
                    <div className="flex gap-5">
                        <FaPrayingHands size={30}/>
                        <p>{placeData?.placeType?.toUpperCase()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
};