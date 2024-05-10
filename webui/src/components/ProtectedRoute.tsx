import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { UserType } from "shared";

export const ProtectedRoute = ({
  children,
  roles,
}: React.PropsWithChildren<{
  roles?: UserType[];
}>) => {
  const { user } = useAuth()!;
  if (!user) {
    return <Navigate to="/login" />;
  } else if (roles && !roles.includes(user.type)) {
    return <Navigate to="/" />;
  }
  return children;
};
