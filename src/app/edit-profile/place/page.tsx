"use client";;
import HomeLayout from "@/components/layouts/home-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import useUser from "@/hooks/use-user";
import { useState } from "react";
import { convertBase64 } from "@/lib/utils";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

const EditPlaceProfile = () => {
  const router = useRouter();
  const { user, userData } = useUser();
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<FileList | null>(null);
  const [placeType, setPlaceType] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [error, setError] = useState<string>("");

  const onSave = () => {
    if (!name || !image || !placeType || !province || !postalCode || !address) {
      setError("Please fill in all fields");
      return;
    }
    convertBase64(image[0]).then((base64) => {
      console.log("Save", name, base64);
      axios
        .post("/api/user/update", {
          id: user?.uid,
          name
        })
        .then(({ data }) => {
          console.log(data);
          router.push("/");
        })
        .catch((error) => {
          console.error("Error updating donor profile:", error);
          setError("Failed to update profile");
        });
    });
  };

  return (
    <HomeLayout>
      <div
        className="flex w-full h-[calc(100vh-80px)] items-center justify-center "
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/thai_temple_bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Edit Place Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col overflow-y-scroll max-h-[300px]">
              <div className="p-1"> Email</div>
              <div className="w-80 p-1">
                <div className="text-gray-700 bg-gray-100 rounded p-2">{userData?.email}</div>
              </div>
              <div className="p-1"> Name</div>
              <div className="w-80 p-1">
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className="p-1"> Place Type</div>
              <div className="w-80 p-1">
                {/* Replace the Input component for Province with a select element */}
                <select
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={placeType}
                  onChange={(e) => setPlaceType(e.target.value)}
                >
                  <option value="">--place type--</option>
                  <option value="temple">Temple</option>
                  <option value="church">Church</option>
                  <option value="mandir">Mandir</option>
                  <option value="mosque">Mosque</option>
                  <option value="synagogue">Synagogue</option>
                  <option value="gurdwara">Gurdwara</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="p-1"> Province</div>
              <div className="w-80 p-1">
                <Input
                  value={province}
                  onChange={(e) => {
                    setProvince(e.target.value);
                  }}
                />
              </div>
              <div className="p-1"> Postal Code</div>
              <div className="w-80 p-1">
                <Input
                  value={postalCode}
                  onChange={(e) => {
                    setPostalCode(e.target.value);
                  }}
                />
              </div>
              <div className="p-1"> Address</div>
              <div className="w-80 p-1">
                <Input
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                />
              </div>
              <div className="p-1">Profile picture</div>
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
                    width={128}
                    height={128}
                    onClick={(e) => {
                      e.preventDefault();
                      setImage(null);
                    }}
                  />
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col">
            {error && <div className="text-red-500">{error}</div>}
            <Button className="w-full" onClick={onSave}>
              Save
            </Button>
          </CardFooter>
        </Card>
      </div>
    </HomeLayout>
  );
};

export default EditPlaceProfile;
