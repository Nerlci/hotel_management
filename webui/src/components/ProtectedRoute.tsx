import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === "true";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()!;
  if (!user && !BYPASS_AUTH) {
    return <Navigate to="/login" />;
  }
  return children;
};
