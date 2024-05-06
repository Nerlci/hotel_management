import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/hooks/useAuth";
import XiaoDing from "../assets/xiaoding.jpg";
import { useMutation } from "@tanstack/react-query";
import { UserType } from "@/lib/types";
import { toast } from "sonner";
import { LoginForm, dataFetch } from "shared";
import { z } from "zod";

const loginFormSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少6个字符"),
});

function parseUserType(type: number): UserType {
  switch (type) {
    case 0:
      return "customer";
    case 1:
      return "admin";
    case 2:
      return "reception";
    default:
      return "customer";
  }
}

const Login = () => {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { login } = useAuth()!;

  const mutation = useMutation({
    mutationFn: dataFetch.postUserLogin,
    onSuccess: (data) => {
      login({
        username: data.payload.username,
        type: parseUserType(data.payload.type),
      });
    },
    onError: (error) => {
      toast(error.message, {
        description: "请检查您的用户名和密码",
      });
    },
  });

  function onSubmit(values: LoginForm) {
    mutation.mutate(values);
  }

  return (
    <>
      <div className="absolute right-2 top-1">
        <ModeToggle />
      </div>
      <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
        <div className="hidden place-content-center bg-muted lg:block">
          <div className="max-h-[100vh]">
            <img src={XiaoDing} />
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">登录</h1>
              <p className="text-balance text-muted-foreground">
                输入您的用户名和密码以继续
              </p>
            </div>
            <div className="grid gap-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-80 space-y-2"
                >
                  <div className="grid gap-2">
                    <Label htmlFor="username">邮箱</Label>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">密码</Label>
                      <Link
                        to="#"
                        className="ml-auto inline-block text-sm underline"
                      >
                        忘记密码
                      </Link>
                    </div>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    登录
                  </Button>
                </form>
              </Form>
            </div>
            <div className="mt-3 text-center text-sm">
              没有帐号？{" "}
              <Link to="/register" className="underline">
                注册
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
