import { AuthContext } from "@/hooks/useAuth";
import { LoggedinUser } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { dataFetch } from "shared";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";

export function AuthProvider({ children }: { children: React.ReactElement }) {
  const [user, setUser] = useLocalStorage<LoggedinUser>("loggedin-user", null);
  const navigate = useNavigate();
  const logoutMutation = useMutation({
    mutationFn: dataFetch.getUserLogout,
    onSuccess: () => {
      toast.success("退出登陆成功");
      setUser(null);
      navigate("/", { replace: true });
    },
    onError: (e) => {
      toast.error("退出登陆失败");
      console.log(e.message);
    },
  });

  const value = useMemo(
    () => ({
      user,
      login: (data: LoggedinUser) => {
        console.log(`logging in: ${JSON.stringify(data)}`);
        setUser(data);
        // TODO redirect to different pages depend on usre type
        if (data!.type === "customer") {
          navigate("/customer");
        } else if (data!.type === "reception") {
          navigate("/reception");
        } else if (data!.type === "aircon-manager") {
          navigate("/airconmanager");
        }
      },
      logout: () => {
        logoutMutation.mutate();
      },
    }),
    [user, navigate, setUser, logoutMutation],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
