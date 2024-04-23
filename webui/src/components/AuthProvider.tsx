import { AuthContext } from "@/hooks/useAuth";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LoggedinUser } from "@/lib/types";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export function AuthProvider({ children }: { children: React.ReactElement }) {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const login = async (data: LoggedinUser) => {
    setUser(data);
    // TODO redirect to different pages depend on usre type
    if (data.type === "customer") {
      navigate("/customer");
    }
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
