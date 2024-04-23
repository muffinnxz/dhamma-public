import { Place } from "@/interfaces/place";
import { Button } from "../ui/button";
import { TypographyH3, TypographyLarge} from "@/components/ui/typography";
import { useRouter } from "@/lib/router-events";
import { FaLocationDot } from "react-icons/fa6";
import { FaPrayingHands } from "react-icons/fa";

export const PlaceRecommend = ({ isLoading, place }: { isLoading: boolean; place: Place }) => {
  const router = useRouter();
  
  if (!isLoading && !place) {
    return (
      <div className="flex flex-col items-center justify-center w-[1102px] h-[394px]">
        <TypographyLarge className="text-foreground text-2xl">No places found</TypographyLarge>
      </div>
    );
  }

  return (
    <div className="flex flex-row w-[1102px] h-[394px] bg-[#FFF5EB] ">
      <div className="grow flex flex-col w-[302px] h-[394px] pl-[20px] gap-[10px] justify-center">
        <p className="text-sm text-yellow-500">INTERESTING PLACE</p>
        <TypographyH3>{place.name.toUpperCase()}</TypographyH3>
        <div className="flex flex-row gap-[10px]">
          <FaLocationDot size={30}/>
          <TypographyLarge>{place.province.toUpperCase()}</TypographyLarge>
        </div>
        <div className="flex flex-row gap-[10px] pb-[5px]">
          <FaPrayingHands size={30}/>
          <TypographyLarge>{place.placeType.toUpperCase()}</TypographyLarge>
        </div>
        <Button variant="donate" className="w-[140px]" onClick={() => router.push(`/place/${place.id}`)}>MORE DETAIL</Button>
      </div>
        <div
          className="flex-none w-[800px] h-[394px] bg-cover bg-center"
          style={{ backgroundImage: `url(${place.picture})`}}
        />
    </div>
  );
};
