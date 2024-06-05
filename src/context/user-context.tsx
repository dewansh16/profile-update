"use client";

import { useToast } from "@/components/ui/use-toast";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from "react";

import LoadingBar from "react-top-loading-bar";
// Define the shape of the user data
interface User {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  profilePhoto: string;
}

// Define the shape of the context
interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Create the context
const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

// Create the context provider component
export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch user data from the API
    const fetchUser = async () => {
      try {
        setLoadingProgress(30);
        const response = await fetch("/api/profile");
        setLoadingProgress(70);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
          setLoadingProgress(100);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
        toast({
          title: "Error fetching user data",
        });
        setLoadingProgress(100);
      }
    };

    fetchUser();
  }, []);

  console.log("user = ", user);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <LoadingBar
        color="#f11946"
        height={3}
        progress={loadingProgress}
        onLoaderFinished={() => setLoadingProgress(0)}
      />
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to consume the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
