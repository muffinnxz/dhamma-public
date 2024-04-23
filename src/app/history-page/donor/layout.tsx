"use client"

import useUser from "@/hooks/use-user";
import { UserType } from "@/interfaces/user";
import { useRouter } from "@/lib/router-events";

export default function HistoryLayout({ children }: {children: React.ReactNode}) {

    const { isLoading, userData } = useUser();
    const router = useRouter();
    if (!isLoading) {
        if (!userData) {
            router.push("/");
        } else if (userData.userType === UserType.place) {
            router.push("/history-page/place");
        }
    }
 
    return children;
}