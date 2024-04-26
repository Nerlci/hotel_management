import { AuthContext } from "@/hooks/useAuth";
import { LoggedinUser } from "@/lib/types";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

export function AuthProvider({ children }: { children: React.ReactElement }) {
  const [user, setUser] = useLocalStorage<LoggedinUser>("loggedin-user", null);
  const navigate = useNavigate();

  const value = useMemo(
    () => ({
      user,
      login: (data: LoggedinUser) => {
        setUser(data);
        // TODO redirect to different pages depend on usre type
        if (data!.type === "customer") {
          navigate("/customer");
        }
      },
      logout: () => {
        if (user) {
          setUser(null);
          // TODO clear cookies
          navigate("/", { replace: true });
        }
      },
    }),
    [user, navigate, setUser],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
