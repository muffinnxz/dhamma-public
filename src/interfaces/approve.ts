import { UserData } from "@/interfaces/user"
export interface ApproveDetail{
    id: string;
    place_id: string;
    evident: string;
    place: Partial<UserData>;
}

export interface ApprovalEvident{
    place_id: string;
    evident: string;
}