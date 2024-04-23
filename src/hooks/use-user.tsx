import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebase-auth";
import { UserData } from "@/interfaces/user";
import axios from "@/lib/axios";
import { Cart,DonationMoney } from "@/interfaces/cart";

interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleChangeUserData: (data: UserData) => void;
  loadUserData: () => Promise<void>;
  carts: Cart[] | null;
  setCarts: React.Dispatch<React.SetStateAction<Cart[] | null>>;
  donationMoneys: DonationMoney[] | null;
  setDonationMoneys: React.Dispatch<React.SetStateAction<DonationMoney[] | null>>;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => null,
  isLoading: false,
  setIsLoading: () => null,
  userData: null,
  setUserData: () => null,
  handleChangeUserData: () => null,
  loadUserData: () => Promise.resolve(),
  carts: [],
  setCarts: () => null,
  donationMoneys: [],
  setDonationMoneys: () => null
});

export default function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be within UserProvider");
  }
  return context;
}

export function UserProvider({ children }: { children?: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [carts, setCarts] = useState<Cart[] | null>([]);
  const [donationMoneys, setDonationMoneys] = useState<DonationMoney[] | null>([]);

  const handleChangeUserData = (data: UserData) => {
    setUserData(data);
  };

  const loadUserData = useCallback(async () => {
    axios
      .post("/user")
      .then(({ data }: any) => {
        handleChangeUserData(data.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        setIsLoading(true); // TODO: remove this line
        loadUserData();
      } else {
        setUser(null);
        setUserData(null);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [loadUserData, setUser]);

  const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    userData,
    setUserData,
    handleChangeUserData,
    loadUserData,
    carts,
    setCarts,
    donationMoneys,
    setDonationMoneys
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
