"use client";
import * as React from "react";

import useUser from "@/hooks/use-user";
import { AppIcon } from "./app-icon";
import { UserAccountNav } from "./user-account-nav";
import { Link } from "@/lib/router-events";

import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { useRouter } from "@/lib/router-events"

export const mainNavItems = [];

export function MainNav() {
  const { userData } = useUser();
  const router = useRouter();

  return (
    <div className="bg-primary-dark-blue sticky top-0">
      <div className="xl:container text-[#f5f2f0] text-lg flex justify-between px-12 py-2">
        <div className="flex gap-6 justify-between">
          <AppIcon/>
          <div className="self-stretch my-auto font-medium">Dhamma</div>
          <div className="self-stretch my-auto cursor-pointer" onClick={() => router.push('/')}>HOME</div>
          <Link href="/#section-4" className="self-stretch my-auto">PLACES</Link>
        </div>
        {!userData && (
        <Link href="/auth" className="justify-center px-10 py-2 my-auto text-primary-dark-blue bg-primary-yellow rounded-xl">
          LOGIN
        </Link>
        )}
        {userData && (
          <div className="flex gap-5">
            <div className="self-stretch my-auto">{userData?.name}</div>
            <UserAccountNav userData={userData} />
            {userData?.userType=="place" && userData?.placeVerified == "verified" && (
              <IoCheckmarkCircleOutline size={48}/>
            )}
          </div>
        )}
        
      </div>
    </div>
    
  );
}
