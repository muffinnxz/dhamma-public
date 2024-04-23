"use client";
import HomeLayout from "@/components/layouts/home-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { convertBase64 } from "@/lib/utils";
import axios from "@/lib/axios";
import { LuLoader, LuMailCheck, LuX } from "react-icons/lu";
import useUser from "@/hooks/use-user";
import { TypographyLarge } from "@/components/ui/typography";
import { PlaceVerifyStatus } from "@/interfaces/user";

const VerifyPlacePage = () => {
  const [image, setImage] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const { userData, loadUserData } = useUser();

  const onSubmit = () => {
    if (!image) {
      toast({
        title: "error",
        description: "please upload an evidence"
      });
      return;
    }
    setIsLoading(true);
    convertBase64(image[0]).then((base64) => {
      axios
        .post("/verify-place", { evident: base64 })
        .then(({ data }) => {
          loadUserData().then(() => {
            toast({
              title: "success",
              description: "evidence sent"
            });
            setIsLoading(false);
          });
        })
        .catch((error) => {
          setIsLoading(false);
        });
    });
  };

  return (
    <HomeLayout>
      <div
        className="flex w-full h-[calc(100vh-80px)] items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/thai_temple_bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {!userData?.placeVerified && (
          <Card>
            <CardHeader>
              <CardTitle>Send verified evidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex w-full justify-center">
                {!image && (
                  <div className="relative flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 ">
                    <div className="absolute flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to update</span>
                      </p>
                    </div>
                    <Input
                      id="dropzone-file"
                      type="file"
                      multiple={false}
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        setImage(e.target.files);
                      }}
                    />
                  </div>
                )}
                {image && (
                  <Image
                    src={URL.createObjectURL(image[0])}
                    alt="123"
                    width={300}
                    height={300}
                    onClick={(e) => {
                      e.preventDefault();
                      setImage(null);
                    }}
                  />
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={!image || isLoading} onClick={onSubmit}>
                {isLoading && <LuLoader className="animate-spin mr-2 h-4 w-4" />}
                Verify
              </Button>
            </CardFooter>
          </Card>
        )}
        {userData?.placeVerified === PlaceVerifyStatus.pending && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">You already send the verified evidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col w-full justify-center items-center h-[150px]">
                <LuMailCheck className="h-20 w-20 text-primary-yellow" />
                <TypographyLarge className="text-center">
                  Your evidence is being verified, please wait for the result
                </TypographyLarge>
              </div>
            </CardContent>
          </Card>
        )}
        {userData?.placeVerified === PlaceVerifyStatus.rejected && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">You have been rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col w-full justify-center items-center h-[150px]">
                <LuX className="h-20 w-20 text-red-500" />
                <TypographyLarge className="text-center">
                  Your evidence is rejected, please contact our support
                </TypographyLarge>
              </div>
            </CardContent>
          </Card>
        )}
        {userData?.placeVerified === PlaceVerifyStatus.verified && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">You already send the verified evidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col w-full justify-center items-center h-[150px]">
                <LuMailCheck className="h-20 w-20 text-green-500" />
                <TypographyLarge className="text-center">
                  You can start using the app now
                </TypographyLarge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </HomeLayout>
  );
};

export default VerifyPlacePage;
