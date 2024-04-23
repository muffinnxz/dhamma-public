"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyH2 } from "@/components/ui/typography";
import { useToast } from "@/components/ui/use-toast";
import { register as registerUser } from "@/lib/firebase-auth";
import { Link, useRouter } from "@/lib/router-events";
import { useForm } from "react-hook-form";
import { LuChevronLeft, LuLoader } from "react-icons/lu";
import { Label } from "../ui/label";
import { UserAvatar } from "../layouts/user-avatar";
import { PlaceType, UserType } from "@/interfaces/user";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import axios from "@/lib/axios";
import { convertBase64 } from "@/lib/utils";
import { useState } from "react";

interface FormInterface {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  picture: FileList;
  userType: UserType;
  placeType?: PlaceType;
  province?: string;
  postalCode?: string;
  placeLocation?: string;
}

export default function RegisterForm() {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm<FormInterface>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit = handleSubmit((data) => {
    if (data.userType === UserType.donor) {
      delete data.placeType;
      delete data.province;
      delete data.postalCode;
      delete data.placeLocation;
    }
    setIsLoading(true);
    registerUser(data.email, data.password)
      .then(async (user) => {
        const picture_base64 = await convertBase64(data.picture[0]);
        console.log(picture_base64);
        axios
          .post("/user/create", {
            id: user.user.uid,
            name: data.name,
            email: data.email,
            picture: picture_base64,
            userType: data.userType,
            placeType: data.placeType,
            province: data.province,
            postalCode: data.postalCode,
            placeLocation: data.placeLocation
          })
          .then(() => {
            setIsLoading(false);
            toast({
              title: "Account created.",
              description: "We've created your account for you."
            });
            router.push("/auth");
          });
      })
      .catch((error) => {
        setIsLoading(false);
        toast({
          title: "An error occurred.",
          description: error.message
        });
      });
  });

  const picture = watch("picture");
  const userType = watch("userType");
  const placeType = watch("placeType");

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col h-full w-fit border p-8 bg-background rounded-lg gap-2 max-h-[500px] overflow-y-scroll">
        <TypographyH2>Register</TypographyH2>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="Email..."
          {...register("email", { required: true })}
          width={300}
          className="w-[300px]"
        />
        {errors.email && <span className="text-xs text-red-500">Email is required</span>}
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Password..."
          {...register("password", { required: true })}
          className="w-[300px]"
        />
        {errors.password && <span className="text-xs text-red-500">Password is required</span>}
        <Label>Confirm Password</Label>
        <Input
          type="password"
          placeholder="Confirm Password..."
          {...register("confirmPassword", { required: true, validate: (value) => value === watch("password") })}
          className="w-[300px]"
        />
        {errors.confirmPassword && <span className="text-xs text-red-500">Confirm password is wrong or missing</span>}
        <Label>Name</Label>
        <Input type="text" placeholder="Name..." {...register("name", { required: true })} className="w-[300px]" />
        {errors.name && <span className="text-xs text-red-500">Name is required</span>}
        <Label>Profile Picture</Label>
        <div className="flex w-full justify-center">
          <div className="relative flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 ">
            {Boolean(picture && picture[0]?.name) && (
              <UserAvatar className="absolute w-full h-full object-cover" profilePicture={picture[0]} />
            )}
            {!Boolean(picture && picture[0]?.name) && (
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
                  <span className="font-semibold">Click to upload</span>
                </p>
              </div>
            )}
            <Input
              id="dropzone-file"
              type="file"
              multiple={false}
              className="absolute w-full h-full opacity-0 cursor-pointer"
              {...register("picture", {
                required: true,
                validate: (files) => {
                  const file = files?.[0];
                  if (!file) return "No file selected";
                  if (!file.type.startsWith("image/")) return "Invalid file type";
                  if (file.size > 2048 * 2048 * 2) return "File too large";
                  return true;
                }
              })}
            />
          </div>
        </div>
        {errors.picture && <span className="text-xs text-red-500">Profile picture is required</span>}
        <Label>User Type</Label>
        <Select
          onValueChange={(e) => {
            setValue("userType", e as UserType);
          }}
          {...register("userType", { required: true })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="--- user or place ---" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UserType.donor}>Donor</SelectItem>
            <SelectItem value={UserType.place}>Place</SelectItem>
          </SelectContent>
        </Select>
        {userType === UserType.place && (
          <>
            <Label>Place Type</Label>
            <Select
              value={placeType}
              onValueChange={(e) => {
                setValue("placeType", e as PlaceType);
              }}
              {...register("placeType", { required: userType === UserType.place })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="--- place type ---" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PlaceType.budishm}>Temple</SelectItem>
                <SelectItem value={PlaceType.christianity}>Church</SelectItem>
                <SelectItem value={PlaceType.hinduism}>Mandir</SelectItem>
                <SelectItem value={PlaceType.islam}>Mosque</SelectItem>
                <SelectItem value={PlaceType.judaism}>Synagogue</SelectItem>
                <SelectItem value={PlaceType.sikhism}>Gurdwara</SelectItem>
                <SelectItem value={PlaceType.other}>Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.placeType && <span className="text-xs text-red-500">Place type is required</span>}
            <Label>Province</Label>
            <Input
              type="text"
              placeholder="Location..."
              {...register("province", { required: userType === UserType.place })}
              className="w-[300px]"
            />
            {errors.postalCode && <span className="text-xs text-red-500">Location is required</span>}

            <Label>Postal Code</Label>
            <Input
              type="text"
              placeholder="Location..."
              {...register("postalCode", { required: userType === UserType.place })}
              className="w-[300px]"
            />
            {errors.postalCode && <span className="text-xs text-red-500">Location is required</span>}

            <Label>Address</Label>
            <Input
              type="text"
              placeholder="Location..."
              {...register("placeLocation", { required: userType === UserType.place })}
              className="w-[300px]"
            />
            {errors.placeLocation && <span className="text-xs text-red-500">Location is required</span>}
          </>
        )}
        {errors.userType && <span className="text-xs text-red-500">User type is required</span>}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <LuLoader className="animate-spin mr-2" />}
          Register
        </Button>
        <Link href="/auth">
          <div className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground/80">
            <LuChevronLeft />
            <span>Back to login</span>
          </div>
        </Link>
      </div>
    </form>
  );
}