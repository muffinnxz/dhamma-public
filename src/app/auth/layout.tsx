"use client";

import useUser from "@/hooks/use-user";
import { useRouter } from "@/lib/router-events";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isLoading, userData } = useUser();
  const router = useRouter();

  if (!isLoading && userData) {
    router.push("/");
  }
  
  return children;
}
