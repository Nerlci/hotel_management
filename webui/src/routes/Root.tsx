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
    } else if (user.type === "aircon-manager") {
      return <Navigate to="/airconmanager" />;
    } else {
      return <Navigate to="/login" />;
    }
  }
}

export default Root;
