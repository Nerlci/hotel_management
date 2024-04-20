import { createContext, useContext } from "react";

type AuthContextType = {
  user: any;
  login: (data: any) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = () => {
  return useContext(AuthContext);
};
