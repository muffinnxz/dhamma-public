import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comment } from "@/interfaces/comment";
import CommentItem from "./comment-item";
import useUser from "@/hooks/use-user";
import { useState } from "react";
import { useEffect } from "react";

export default function CommentSection({
  commentList,
  userComment,
  onChange,
  onClick,
  onDelete,
  onUpdate
}: {
  commentList: Comment[];
  userComment: String;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClick: () => void;
  onDelete: (commentId: string) => void;
  onUpdate: (commentId: string, updatedComment: string) => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { userData } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      try {
        const sortedComments = commentList.sort((a, b) => {
          const dateA = new Date(a.createdAt._seconds * 1000 + a.createdAt._nanoseconds / 1000000);
          const dateB = new Date(b.createdAt._seconds * 1000 + b.createdAt._nanoseconds / 1000000);
          return dateB.getTime() - dateA.getTime();
        });
        setComments(sortedComments);
      } catch (error) {
        console.error("Error loading comments: ", error);
      }
      setIsLoading(false);
    };
    loadComments();
  }, [commentList]);

  return (
    <div>
      <p className="text-5xl font-bold">COMMENT</p>
      <div className="flex mt-10 items-start">
        <Avatar>
          <AvatarImage className="object-cover" src={userData?.picture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col w-full gap-2 mx-6">
          <Textarea
            value={userComment.toString()}
            className="font-medium text-lg"
            placeholder="Type your comment..."
            onChange={onChange}
          />
          <div className="flex justify-end">
            <Button
              className={`font-medium text-base w-[80px] tracking-widest `}
              onClick={onClick}
              disabled={!userComment}
            >
              Post
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-4 mt-7">
        {comments.map((c) => (
          <div key={c.id} className="d-flex align-items-start mb-4">
            <CommentItem c={c} userId={userData?.id} handleDelete={onDelete} handleUpdate={onUpdate} />
          </div>
        ))}
      </div>
    </div>
  );
}
