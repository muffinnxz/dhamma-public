
import { DonationItem } from './request-item';

export interface Cart{
    placeId: string;
    donateItems: DonationItem[];
}

export interface DonationMoney{
    placeId: string;
    amount: number;
}