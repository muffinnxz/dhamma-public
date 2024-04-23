"use client"

import { RiVideoUploadLine } from "react-icons/ri";
import { useState } from "react";
import axios from '@/lib/axios';
import Link from "next/link";

export default function BlessingItem({
  donorName,
  itemList,
  totalPrice,
  status,
  createdAt,
  isBlessed,
  isLoading,
  isSomeoneUploading,
  setIsSomeoneUploading,
  id
}: {
  donorName: string;
  itemList: {
    [key: string]: number;
  };
  totalPrice?: number;
  status: string;
  createdAt: string;
  isBlessed: boolean;
  isLoading: boolean;
  isSomeoneUploading: boolean;
  setIsSomeoneUploading: Function;
  id: string;
}) {

  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File>();

  if (isLoading) {
    return (
      <div className="w-full g-60 flex items-center justify-center duration-200 hover:drop-shadow">
        <h3>Loading...</h3>
      </div>
    );
  } else {
    let itemListNodes: React.ReactNode[] = [];
    let count = 0;
    let limit = 3;
    for (const [key, value] of Object.entries(itemList)) {
      if (count < limit) {
        itemListNodes.push(
          <li key={key} className="w-24 truncate">
            {value} {key}
          </li>
        );
      }
      count++;
    }

    const isUploadButtonDisabled = (file === null || file === undefined);

    return (
      <div className="w-full h-60 p-12 rounded-lg bg-white duration-200 hover:drop-shadow flex items-center justify-between overflow-hidden">
        <div className="flex">
          <div className="relative h-full">
            <h3 className="text-4xl min-w-48 max-w-60 truncate">{donorName}</h3>
            <div className="mt-3 flex">
              {itemListNodes.length > 0 ? (
                <>
                  <ul className="truncate h-24">
                    {itemListNodes}
                    {count > limit ? <li className="mt-[-12px] text-2xl">...</li> : null}
                  </ul>
                  <ul className="ml-5">
                    <li>{typeof totalPrice === "number" ? `${totalPrice} Baht` : null}</li>
                  </ul>
                </>
              ) : (
                <ul>
                  <li>{typeof totalPrice === "number" ? `${totalPrice} Baht` : null}</li>
                </ul>
              )}
            </div>
          </div>
          <div>
            {isBlessed ? (
              <div>
                <h3 className="w-48 ml-4 py-2 text-center text-white bg-green-600 rounded-md">Blessed</h3>
                <h4 className="text-xs mt-2 ml-8">Donated at {createdAt}</h4>
              </div>
            ) : (
              <div>
                <h3 className="w-48 ml-4 py-2 text-center text-white bg-slate-500 rounded-md">Unblessed</h3>
                <h4 className="text-xs mt-2 ml-8">Donated at {createdAt}</h4>
              </div>
            )}
          </div>
          
        </div>
        {isBlessed ? (
          <div className="h-full flex items-center">
            <Link href={`/video-blessed/${id}`} target="_blank" className="px-4 py-2 bg-green-800 text-white rounded-md duration-200 hover:drop-shadow-md">
              Watch Blessing Video
            </Link>
          </div>
        ) : (
          <form className="h-full flex items-center space-x-3">
            <label className="cursor-pointer">
              <div className="flex items-center px-4 py-2 bg-amber-200 text-black rounded-md duration-200 hover:drop-shadow-md">
                {
                  (fileName === "") ?
                  <>
                    <RiVideoUploadLine size={20} style={{ marginRight: '4px' }} />
                    Upload Blessing Video
                  </> :
                  fileName
                }
              </div>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  setFileName(e.currentTarget.value.replace("C:\\fakepath\\", ""));
                  setFile(e.currentTarget.files![0])
                }}
              />
            </label>
            <button
              disabled={isUploadButtonDisabled || isSomeoneUploading}
              className={"px-4 py-2 rounded-md " + ((isUploadButtonDisabled || isSomeoneUploading) ? " bg-slate-400 text-white " : " bg-sky-950 text-white duration-200 hover:drop-shadow-md ")}
              onClick={(e) => {
                e.preventDefault();
                // upload
                async function upload() {
                  const base64File = await toBase64(file!);
                  setIsSomeoneUploading(true);
                  try {
                    const response = await axios.post(`/blessed-video/${id}`, {
                      video: base64File,
                      title: "",
                      desc: ""
                    });
                  } catch (err) {
                    console.log(err);
                  }
                  location.reload();
                  setIsSomeoneUploading(false);
                }
                upload();
                // finish upload
              }}
            >
              {
                (isUploadButtonDisabled || isSomeoneUploading) ? 
                "Disabled" :
                "Upload"
              }
            </button>
          </form>
        )}
      </div>
    );
  }
}

export const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });