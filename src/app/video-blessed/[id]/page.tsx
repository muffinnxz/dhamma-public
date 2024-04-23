"use client";
import HomeLayout from "@/components/layouts/home-layout";
import useUser from "@/hooks/use-user";
import axios from "@/lib/axios";
import { AxiosError } from 'axios';
import { BlessedVideo } from "@/interfaces/blessedVideo"
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bVidData, setbVid] = useState<BlessedVideo>();
  const [resStat, setResStat] = useState<number>(0);
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/blessed-video/" + params.id);
        setbVid(res.data.data);
        console.log(res.data.data);
        setResStat(200)
        setIsLoading(false);
      } catch (err) {
        const errors = err as AxiosError;
        if (!errors.response){
          console.log(errors);
          return;
        }
        console.log(errors.response.data);
        setResStat(errors.response.status || 0)
        setIsLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user, params.id]);

  if (!isLoading && bVidData != null){
    return (
      <HomeLayout>
        <div className="bg-gray-700 bg-cover bg-no-repeat bg-fixed " 
        style={{backgroundImage: "url("+ bVidData.placePicture +")"}}>
          <div className="bg-gradient-to-t from-background pt-20 pb-5">
            <div className="w-full mx-auto sm:w-4/5">
              <div className="bg-opacity-80 bg-black backdrop-blur-sm rounded-lg">
                <video src={bVidData.url}
                className="w-full max-h-dvh rounded-lg"
                controls>
                </video>
              </div>
            </div>
          </div>
        </div>
        <div className="py-5">
          <div className="w-5/6 mx-auto sm:w-4/5">
            <div className="w-full text-center">
              <h1 className="text-4xl font-bold">{bVidData.title}</h1>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-right">
                  <p className="text-lg">Place: {bVidData.placeName}</p>
                </div>
                <div className="text-left">
                  <p className="text-lg">Donate at: {(new Date(bVidData.createdAt)).toDateString()}</p>
                </div>
              </div>
            </div>
            <hr className="w-full h-px my-2 bg-gray-300 border-0" />
            <div className="w-full text-left min-h-96 mb-10">
              <p className="text-2xl">{bVidData?.desc}</p>
            </div>
          </div>
        </div>
      </HomeLayout>
    );
  }
  if (!isLoading && bVidData == null && resStat != 0){
    return (
      <HomeLayout>
        <div className="w-1/2 mx-auto text-center mt-40">
        <h1 className="text-5xl text-yellow-500">{resStat}</h1>
        </div>
      </HomeLayout>
    );
  }
  return (
    <HomeLayout>
      <div className="border-gray-300 h-20 w-20 mx-auto animate-spin rounded-full border-8 border-t-yellow-500 mt-40" />
    </HomeLayout>
  );
}
