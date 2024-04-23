"use client";

import useUser from "@/hooks/use-user";
import { UserType } from "@/interfaces/user";
import { useRouter } from "@/lib/router-events";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isLoading, userData } = useUser();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (!userData || userData.userType !== UserType.place) {
    router.push("/");
    return null; 
  }

  return children; 
}
