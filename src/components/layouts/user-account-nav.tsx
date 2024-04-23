"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "./user-avatar";
import { signOut } from "@/lib/firebase-auth";
import { Link } from "@/lib/router-events";
import { PlaceVerifyStatus, UserData, UserType } from "@/interfaces/user";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  userData: UserData | null;
}

export function UserAccountNav({ userData }: UserAccountNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex justify-center items-center h-full">
        <UserAvatar profilePicture={userData?.picture} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-4" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{userData?.name}</p>
            {userData?.email && <p className="w-[200px] truncate text-sm text-muted-foreground">{userData.email}</p>}
          </div>
        </div>

        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={userData?.userType === UserType.donor ? "/edit-profile/donor" : "/edit-profile/place"}>
              SETTING
            </Link>
          </DropdownMenuItem>
        </>
        {userData?.isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/stock-management">STOCK MANAGEMENT</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/check-verify-place">CHECK VERIFY PLACE</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/admin/set-delivery-status">SET DELIVERY STATUS</Link>
            </DropdownMenuItem>
          </>
        )}



        {userData?.userType == UserType.place && (
          <>
            <DropdownMenuSeparator />
            {userData?.placeVerified !== PlaceVerifyStatus.verified && (
              <DropdownMenuItem asChild>
                <Link href="/verify-place">VERIFY MY PLACE</Link>
              </DropdownMenuItem>
            )}
            {userData?.placeVerified === PlaceVerifyStatus.verified && (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/request">MANAGE DONATION REQUEST</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/blessing-task">BLESSING TASK</Link>
                </DropdownMenuItem>
              </>
            )}
          </>
        )}

        {!userData?.isAdmin &&
          userData?.userType == UserType.donor && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/history-page/donor">HISTORY</Link>
              </DropdownMenuItem>
            </>
          )}
        {!userData?.isAdmin &&
          (userData?.userType == UserType.place && userData?.placeVerified == "verified") && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/history-page/place">HISTORY</Link>
              </DropdownMenuItem>
            </>
          )}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onSelect={signOut}>
          SIGN OUT
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
