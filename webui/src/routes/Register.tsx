import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { postUserRegister } from "@/lib/dataFetch";
import { toast } from "sonner";

const registerFormSchema = z.object({
  username: z.string().min(3, "用户名至少3个字符"),
  email: z.string().email("无效邮箱地址"),
  password: z.string().min(6, "密码至少6个字符"),
});

export type RegisterForm = z.infer<typeof registerFormSchema>;

export const Register = () => {
  const navigate = useNavigate();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: postUserRegister,
    onSuccess: () => {
      navigate("/login");
    },
    onError: (error) => {
      console.log(error.message);
      toast(error.message, {
        description: "注册失败",
      });
    },
  });

  function onSubmit(values: RegisterForm) {
    mutation.mutate(values);
  }

  return (
    <div className="min-h-screen place-content-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-4xl">注册</CardTitle>
          {mutation.isError ? (
            <CardDescription className="text-destructive">
              注册失败：{mutation.error.message}
            </CardDescription>
          ) : (
            <CardDescription>输入您的信息以创建一个新账户</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-2"
              >
                <div className="grid gap-2">
                  <Label htmlFor="username">用户名</Label>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="text" placeholder="张三" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">邮箱</Label>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">密码</Label>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={mutation.isPending || mutation.isSuccess}
                >
                  创建账户
                </Button>
                <Button type="button" variant="outline" className="w-full">
                  使用微信登录
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-4 text-center text-sm">
            已经有帐号？{" "}
            <Link to="/login" className="underline">
              登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
