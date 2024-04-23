"use client";
import HomeLayout from "@/components/layouts/home-layout";
import { Button } from "@/components/ui/button";
import { TypographyH2, TypographyLarge, TypographyMedium } from "@/components/ui/typography";
import useUser from "@/hooks/use-user";
import { ApproveDetail } from "@/interfaces/approve";
import axios from "@/lib/axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LuLoader } from "react-icons/lu";

const CheckApprovalPage = () => {
  const { user } = useUser();
  const [places, setPlaces] = useState<ApproveDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;
    axios.get("verify-place").then(({ data }) => {
      setPlaces(data.data);
    });
  }, [user]);

  const onApprove = (id: string) => {
    setIsLoading(true);
    axios
      .post(`verify-place/${id}`, { approve: true })
      .then(({ data }) => {
        axios.get("verify-place").then(({ data }) => {
          setPlaces(data.data);
          setIsLoading(false);
        });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const onReject = (id: string) => {
    setIsLoading(true);
    axios
      .post(`verify-place/${id}`, { approve: false })
      .then(({ data }) => {
        axios.get("verify-place").then(({ data }) => {
          setPlaces(data.data);
          setIsLoading(false);
        });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <HomeLayout>
      <div
        className="relative flex w-full h-[300px] bg-cover bg-no-repeat bg-blend-overlay"
        style={{
          backgroundImage: `url('/images/christian_church.jpg')`
        }}
      >
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50"></div>
        <div className="container h-full z-10">
          <div className="flex flex-1 h-full items-center">
            <div className="flex flex-col justify-center">
              <TypographyH2 className="text-white text-7xl">CHECK VERIFY PLACE</TypographyH2>
              <TypographyLarge className="text-white">ADMIN</TypographyLarge>
            </div>
          </div>
          <div className="flex flex-1"></div>
        </div>
      </div>
      <div className="flex flex-col px-20 mt-8 mb-8 gap-4">
        {places.map((place) => (
          <div className="flex items-center w-full border rounded-md p-4 justify-around" key={place.place_id}>
            <div className="flex flex-col gap-2">
              <Image src={place.place.picture || ""} alt="place picture" width={300} height={300} />
              <TypographyLarge>{place.place.name}</TypographyLarge>
              <TypographyMedium>
                {place.place.province}, {place.place.postalCode}
              </TypographyMedium>
            </div>
            <div className="flex flex-col gap-2">
              <Image src={place.evident} alt="evidence" width={300} height={300} />
              <TypographyLarge>Evidence</TypographyLarge>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="w-40" disabled={isLoading} onClick={() => onApprove(place.place_id)}>
                {isLoading && <LuLoader className="animate-spin mr-2 h-4 w-4" />}
                Approve
              </Button>
              <Button
                className="w-40"
                variant="destructive"
                disabled={isLoading}
                onClick={() => onReject(place.place_id)}
              >
                {isLoading && <LuLoader className="animate-spin mr-2 h-4 w-4" />}
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </HomeLayout>
  );
};

export default CheckApprovalPage;
