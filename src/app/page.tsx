"use client";
import { PlaceGrid } from "@/components/landing/place-grid";
import { PlaceRecommend } from "@/components/landing/place-recommend";
import HomeLayout from "@/components/layouts/home-layout";
import { Input } from "@/components/ui/input";
import { TypographyH1, TypographyH2, TypographyH4, TypographyP} from "@/components/ui/typography";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";

import { Place } from "@/interfaces/place";
import useUser from "@/hooks/use-user";
// import { cookies } from 'next/headers'

// import { Cart } from "@/interfaces/cart";

// import { useCookies } from "react-cookie";

export default function Page() {
  const [places, setPlaces] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPlaces, setFilteredPlaces] = useState<any[]>(places);
  const [randomPlace, setRandomPlace] = useState<any>(places[0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // const [cookies, setCookie] = useCookies(['carts']);
  // const cookiestore = cookies();

  const { carts, setCarts } = useUser();
  // const cartsValue = res.cookies.get('carts');
  // if (cartsValue) {
  //   setCarts(cartsValue as unknown as Cart[] ?? []);
  // } else {
  //   setCarts([]);
  // }


  // if (cookies.carts) {
  //     setCarts(cookies.carts);
  //   }

  // useEffect(() => {
  //   setCookie('carts', carts, { path: '/' });
  // }, [carts, setCookie]);

  // useEffect(() => {
  //   console.log("page",cookies.carts);
  // }, [cookies]);

  const loadPlaces = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/place`);
      const places = res.data.data
      places.sort((a: Place, b: Place) => a.name.localeCompare(b.name));
      setPlaces(places);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if(!isLoading){
      const placesWithRequestItems = places.filter((v: Place) => v.requestData?.requestItems?.length ? v.requestData?.requestItems?.length > 0 : false);
      const randomIndex = Math.floor(Math.random() * placesWithRequestItems.length);
      const selectedPlace = placesWithRequestItems[randomIndex];
      setRandomPlace(selectedPlace);
    }
  }, [isLoading, places])

  useEffect(() => {
    loadPlaces();
  }, []);
  
  useEffect(() => {
    const newPlaces = places.filter((v) => v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.province.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredPlaces(newPlaces);
  }, [searchTerm, places]);
  
  return (
    <HomeLayout>
      <div id="section-1" className="flex relative" style={{ backgroundImage: 'url("/images/cropped_main_bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>
        <div className="flex flex-col w-full justify-center items-start gap-[12px] ml-[50px]">
          <TypographyH4 className="text-white">WELCOME TO DHAMMA</TypographyH4>
          <TypographyH1 className="text-left text-white">
            BLESSING AS A SERVICE <br />
            A SIMPLE WAY TO <br />
            BLESS YOUR LIFE
          </TypographyH1>
        </div>
      </div>
      <div id="section-2" className="flex flex-col py-[200px] px-[200px] w-full justify-center items-center">
        <div className="flex flex-col w-full justify-center items-center">
          <TypographyP className="text-center text-black mb-[20px]">ABOUT US</TypographyP>
          <TypographyH2 className="text-center text-black">DONATE AND BLESSING</TypographyH2>
          <TypographyP className="text-center text-black mb-[40px]">
            {"Dhamma"} is a platform that provides services for people of all religions, whether Buddhist, Christian, or <br />
            Muslim, who are interested in donating money to religious institutions according to their own faith. <br />
            Dhamma acts as an intermediary between religious institutions and followers to facilitate donations, providing <br />
            additional avenues for religious institutions to receive contributions, as well as offering options for followers to <br />
            donate according to their preferences.
          </TypographyP>
        </div>
        <div className="flex flex-row justify-center items-center">
          <div className="basis-1/3 mr-[20px]">
            <div
              className="w-[280px] h-[360px] bg-cover bg-center rounded-xl mb-[20px]"
              style={{ backgroundImage: `url("/images/food.svg")` }}
            />
            <div className="p-2">
              <TypographyH2 className="text-center text-black">FOOD</TypographyH2>
          </div>
          </div>
          <div className="basis-1/3 ml-[20px] mr-[20px]">
            <div
              className="w-[360px] h-[480px] bg-cover bg-center rounded-xl mb-[20px]"
              style={{ backgroundImage: `url("/images/fan.avif")` }}
            />
            <div className="p-2">
              <TypographyH2 className="text-center text-black">APPLIANCE</TypographyH2>
            </div>
          </div>
          <div className="basis-1/3 ml-[20px]">
            <div
              className="w-[280px] h-[360px] bg-cover bg-center rounded-xl mb-[20px]"
              style={{ backgroundImage: `url("/images/blessing.jpg")` }}
            />
            <div className="p-2">
              <TypographyH2 className="text-center text-black">BLESSING</TypographyH2>
            </div>
          </div>
        </div>
      </div>
      <div id="section-3" className="flex flex-col px-28 w-full justify-center items-center mb-[150px]">
        <TypographyP>RECOMMENDED PLACE</TypographyP>
        <TypographyH2 className="text-center mb-[20px]" >
            JOIN US AND BECOME PART <br />
            OF SOMETHING GREAT
         </TypographyH2>
        <PlaceRecommend isLoading={false} place={randomPlace}/>
      </div>
      <div id="section-4" className="flex flex-col mb-[200px] w-full justify-center items-center">
        <TypographyH2 className="mt-[50px]">TELL US WHAT ARE YOU LOOKING FOR?</TypographyH2>
        <div className="flex items-center gap-2 my-4">
          <Input placeholder="Search for a place" className="w-[600px]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
          <LuSearch className="w-6 h-6" />
        </div>
        <PlaceGrid isLoading={false} places={filteredPlaces} />
      </div>
    </HomeLayout>
  );
}
