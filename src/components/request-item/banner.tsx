import React from "react";
import requestedItemBanner from "../../../public/images/requested-item-banner.svg";
import Image from "next/image";

export const ImageBanner = () => {
  return (
    <section className="flex overflow-hidden relative flex-col justify-center items-start p-12 font-semibold h-[300px] text-stone-100 max-md:px-5">
      <Image
        loading="lazy"
        src={requestedItemBanner.src}
        alt="Requested Item Background"
        className="object-cover absolute inset-0 w-full h-full"
        fill
      />
      <div className="relative z-10">
        <h1 className="text-[64px]">REQUESTED ITEM</h1>
        <p className="mt-4 text-2xl max-w-full">PLACES &gt; REQUESTED ITEM</p>
      </div>
    </section>
  );
};
