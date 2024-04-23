import React from "react";

const DonationStatistic = ({ title, value, date }: { title: string; value: string; date: string }) => (
  <section className="px-7 py-10 w-full bg-white rounded-xl">
    <h2 className="text-3xl text-black">{title}</h2>
    <p className="justify-center px-6 pb-2 pt-1 mt-5 text-4xl text-gray-900 whitespace-nowrap border-solid border-b-[1.5px] border-b-neutral-400">
      {value}
    </p>
    <time className="self-end mt-1.5 text-base font-bold whitespace-nowrap text-neutral-400">{date}</time>
  </section>
);

const DonationDetail = ({ name, details, date }: { name: string; details: string; date: string }) => (
  <div className="flex flex-col py-1.5 mt-4 border-b border-solid border-b-neutral-400">
    <h3 className="text-base whitespace-nowrap text-neutral-600">{name}</h3>
    <div className="flex gap-5 justify-between mt-2.5">
      <p className="text-xl text-black">{details}</p>
      <time className="text-base text-neutral-400">{date}</time>
    </div>
  </div>
);

const DonationDetailsList = ({ donations }: { donations: { name: string; details: string; date: string }[] }) =>
  donations.map((donation, index) => <DonationDetail key={index} {...donation} />);

export const DonationDashboard = () => {
  const totalDonation = {
    title: "TOTAL DONATION",
    value: "5,000,000 $",
    date: "17 FEB 2023"
  };

  const latestDonations = [
    { name: "PRAYU CHA", details: "FOOD 5 PC.", date: "17 FEB 2023" },
    { name: "PRAYU CHA", details: "ELECTRICITY BILL 200 $", date: "17 FEB 2023" },
    { name: "PRAYU CHA", details: "UTENSILS 4 PC.", date: "17 FEB 2023" },
    { name: "PRAYU CHA", details: "FOOD 2 PC.", date: "17 FEB 2023" }
  ];

  return (
    <main className="flex flex-col font-semibold max-w-[300px]">
      <DonationStatistic {...totalDonation} />
      <section className="flex flex-col justify-center px-7 py-11 mt-11 w-full bg-white rounded-xl">
        <h2 className="text-3xl text-black font-semibold">LATEST DONATIONS</h2>
        <DonationDetailsList donations={latestDonations} />
      </section>
    </main>
  );
};
