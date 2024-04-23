import { Timestamp } from "firebase/firestore";

export interface Comment {
    id: string;
    userId: string;
    placeId: string;
    comment: string;
    createdAt: {
        _nanoseconds:number, 
        _seconds:number
        };
}
