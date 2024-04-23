import { LoggedinUser } from "@/lib/types";
import { createContext, useContext } from "react";

type AuthContextType = {
  user: LoggedinUser;
  login: (data: LoggedinUser) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = () => {
  return useContext(AuthContext);
};
