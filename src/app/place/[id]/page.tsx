"use client";
import HomeLayout from "@/components/layouts/home-layout";
import Header from "@/components/place-detail/header";
import InfoSection from "@/components/place-detail/place-info";

import DonationSection from "@/components/place-detail/donation-section";
import LastDonationSection from "@/components/place-detail/last-donation-section";
import axios from "@/lib/axios";

import { UserData } from "@/interfaces/user";
import { Stock } from "@/interfaces/stock";
import CartIcon from "@/components/place-detail/cart-icon";
import { use, useEffect, useState } from "react";
import useUser from "@/hooks/use-user";

import { UserType } from "@/interfaces/user";
import { set } from "react-hook-form";
import DonationMoneySection from "@/components/place-detail/donation-money-section";
import { Timestamp } from "firebase-admin/firestore";
import CommentSection from "@/components/place-detail/comment-section";
import user from "@/pages/api/user";
import { Comment } from "@/interfaces/comment";

export default function Page({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [placeData, setPlace] = useState<UserData>();
  const { userData } = useUser();
  const [userComment, setUserComment] = useState<String>("");
  const [donations, setDonations] = useState<
    {
      createdAt: Timestamp;
      totalPrice: number;
      donorName: string;
    }[]
  >([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [requestsItems, setRequestItems] = useState<{ stock: Stock; amount: number }[]>([]);
  const [requestMoney, setRequestMoney] = useState<number>(0);
  useEffect(() => {
    if (placeData) {
      const fetchRequestItems = async () => {
        setIsLoading(true);
        try {
          const res = await axios.get(`/request-item/${placeData.id}`);
          setRequestItems(res.data.data.requestItems);
          setRequestMoney(res.data.data.requestMoney);
          setIsLoading(false);
        } catch (err) {
          console.error(err);
          setIsLoading(false);
        }
      };
      fetchRequestItems();
    }
  }, [placeData]);

  useEffect(() => {
    try {
      axios.get(`/order/${params.id}`).then((res) => {
        setDonations(res.data);
      });
    } catch (err) {
      console.error(err);
    }
  }, [params.id]);

  const HandleComment = async () => {
    try {
      const res = await axios.post(`/comment/create`, { placeId: params.id, comment: userComment });
      const newComment = res.data.data;
      var date = new Date(newComment.createdAt);
      var seconds = Math.floor(date.getTime() / 1000);
      newComment.createdAt = { _seconds: seconds, _nanoseconds: 0 };
      setComments((prevComments) => [...prevComments, newComment]);
      setUserComment("");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadPlace = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/place/${params.id}`);
        setPlace(res.data.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    loadPlace();
  }, [params.id]);

  useEffect(() => {
    const loadComment = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/comment/${params.id}`);
        setComments(res.data.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    loadComment();
  }, [params.id]);

  const handleDelete = async (commentId: String) => {
    setIsLoading(true);
    try {
      await axios.delete(`/comment/${commentId}/delete`);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting comment: ", error);
      setIsLoading(false);
    }
  };

  const handleUpdate = async (commentId: string, updatedComment: string) => {
    setIsLoading(true);
    try {
      const res = await axios.put(`/comment/update`, {
        commentId: commentId,
        comment: updatedComment
      });
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === commentId) {
            return res.data.data;
          }
          return comment;
        })
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating comment: ", error);
      setIsLoading(false);
    }
  };

  return (
    <HomeLayout>
      {userData?.userType === UserType.donor && requestsItems.length > 0 && (
        <div className="fixed bottom-28 right-20 z-50 ">
          <CartIcon id={params.id} requestItems={requestsItems}></CartIcon>
        </div>
      )}

      <div className="bg-primary-light-yellow space-y-10 pb-10">
        <Header />
        <div className="container px-20 space-y-52">
          <div className="flex justify-between">
            <div className="w-[800px] space-y-10">
              {!isLoading && placeData && <InfoSection placeData={placeData} />}
            </div>

            <div className="space-y-10">{donations.length > 0 && <LastDonationSection donations={donations} />}</div>
          </div>
          <div>
            {requestMoney > 0 && (
              <DonationMoneySection id={params.id} requestMoney={requestMoney} isLoading={isLoading} />
            )}
          </div>
          <div className="">
            {requestsItems.length > 0 && (
              <DonationSection id={params.id} requests={requestsItems} isLoading={isLoading} />
            )}
          </div>
          <div className="px-5 space-y-3">
            <CommentSection
              commentList={comments}
              userComment={userComment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUserComment(e.target.value)}
              onClick={HandleComment}
              onDelete={handleDelete}
              onUpdate={handleUpdate} // Pass handleUpdate function
            />
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
