import { AvatarProps } from "@radix-ui/react-avatar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LuUser } from "react-icons/lu";

interface UserAvatarProps extends AvatarProps {
  profilePicture?: string | File;
}

export function UserAvatar({ profilePicture, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {Boolean(profilePicture) && profilePicture ? (
        <div className="w-full h-full rounded-full border border-gray-300">
          {profilePicture instanceof File ? (
            <AvatarImage alt="avatar picture" src={URL.createObjectURL(profilePicture)} />
          ) : null}
          {typeof profilePicture === "string" && <AvatarImage alt="avatar picture" src={profilePicture} />}
        </div>
      ) : (
        <AvatarFallback>
          <LuUser className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
