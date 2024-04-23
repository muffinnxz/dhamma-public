import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";
import { Comment } from "@/interfaces/comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VscKebabVertical } from "react-icons/vsc";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function CommentItem({
  c,
  userId,
  handleDelete,
  handleUpdate
}: {
  c: Comment;
  userId: string | undefined;
  handleDelete: (commentId: string) => void;
  handleUpdate: (commentId: string, updatedComment: string) => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedComment, setUpdatedComment] = useState<string>(c.comment);

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const donorResponse = await axios.get(`/donor/${c.userId}`);
        setUserData(donorResponse.data.data);
      } catch (donorError) {
        try {
          const placeResponse = await axios.get(`/place/${c.userId}`);
          setUserData(placeResponse.data.data);
        } catch (placeError) {
          console.error("Error loading user data: ", placeError);
        }
      }
      setIsLoading(false);
    };
    loadUserData();
  }, [c.userId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdatedComment(c.comment);
  };

  const handleSaveEdit = () => {
    handleUpdate(c.id, updatedComment);
    setIsEditing(false);
  };

  return (
    <div className="flex">
      <Avatar>
        <AvatarImage className="object-cover" src={userData?.picture} alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col mx-6 w-full">
        <div className="flex justify-between items-center mt-1">
          <div className="flex">
            <p className="font-bold text-lg">{userData?.name}</p>
            <p className="font-weight-bold text-lg text-slate-500 mx-2">
              {formatDistanceToNow(new Date(c.createdAt._seconds * 1000))}
            </p>
          </div>
          {userId === c.userId ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex justify-center items-center h-full">
                <VscKebabVertical className="color-[#161722]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-4" align="center">
                {!isEditing ? (
                  <>
                    <DropdownMenuItem onClick={handleEdit} asChild>
                      <div className="flex justify-between">
                        <p className="text-l font-semibold">Edit</p>
                        <AiFillEdit />
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                ) : null}
                <DropdownMenuItem onClick={() => handleDelete(c.id)} asChild>
                  <div className="flex justify-between">
                    <p className="text-l font-semibold">Delete</p>
                    <MdDelete />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
        {isEditing ? (
          <Textarea
            value={updatedComment}
            className="font-medium text-lg "
            onChange={(e) => setUpdatedComment(e.target.value)}
          />
        ) : (
          <p className="font-medium overflow-auto break-words whitespace-pre-wrap text-lg py-2">{c.comment}</p>
        )}
        <div className="h-8">
          {userId === c.userId && isEditing ? (
            <div className="flex justify-end gap-2 my-2">
              <Button className="text-base py-2 rounded-lg" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button className="text-base py-2 rounded-lg" onClick={handleSaveEdit}>
                Save
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
