import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

function Root() {
  const { user } = useAuth()!;
  if (!user) {
    return <Navigate to="/login" />;
  } else {
    if (user.type === "customer") {
      return <Navigate to="/customer" />;
    } else if (user.type === "reception") {
      return <Navigate to="/reception" />;
    }
  }
}

export default Root;
