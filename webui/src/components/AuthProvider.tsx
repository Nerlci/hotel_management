import { AuthContext } from "@/hooks/useAuth";
import { getUserLogout } from "@/lib/dataFetch";
import { LoggedinUser } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";

export function AuthProvider({ children }: { children: React.ReactElement }) {
  const [user, setUser] = useLocalStorage<LoggedinUser>("loggedin-user", null);
  const navigate = useNavigate();
  const logoutMutation = useMutation({
    mutationFn: getUserLogout,
    onSuccess: () => {
      setUser(null);
      navigate("/", { replace: true });
    },
    onError: (e) => {
      toast(e.message, {
        description: "退出登陆失败",
      });
    },
  });

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
          logoutMutation.mutate();
        }
      },
    }),
    [user, navigate, setUser, logoutMutation],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
