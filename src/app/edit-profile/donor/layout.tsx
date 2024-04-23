"use client";

import useUser from "@/hooks/use-user";
import { UserType } from "@/interfaces/user";
import { useRouter } from "@/lib/router-events";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isLoading, userData } = useUser();
  const router = useRouter();

  if (isLoading) {
    // Show a loading or waiting screen while user data is being loaded
    return <div>Loading...</div>; // Customize this as needed
  }

  // After loading, redirect based on user status or userType
  if (!userData || userData.userType !== UserType.donor) {
    router.push("/");
    return null; // Prevents the component from rendering anything else
  }

  return children; // The actual page content for authenticated donors
}
