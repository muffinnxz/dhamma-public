import DonationCard from "./donation-card";

import axios from "@/lib/axios";
import { Timestamp } from "firebase-admin/firestore";
import { use, useEffect, useState } from "react";

interface Donation {
    createdAt: Timestamp;
    totalPrice: number;
    donorName: string;
}

export default function LastDonationSection({donations}: {donations: Donation[]} ) {

    return (
        <div className="bg-white px-8 py-8 font-semibold space-y-4 rounded-lg w-96 shadow-md">
            <p className="text-3xl text-primary-dark-blue">LASTEST DONATIONS</p>
            <div className="mx-4 space-y-2">
                {donations.map((donation) => (
                    <DonationCard
                        key={donation.createdAt.seconds}
                        createdAt={donation.createdAt}
                        totalPrice={donation.totalPrice}
                        donorName={donation.donorName}
                    />
                ))}
            </div>
        </div>
    )
    }