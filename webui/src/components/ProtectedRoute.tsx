import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()!;
  console.log(user);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};
