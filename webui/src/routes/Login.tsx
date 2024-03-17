import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NavBar } from "@/components/NavBar";

export enum UserType {
  Customer = "customer",
  Staff = "staff",
  Admin = "admin",
}

export interface LoginProps {
  type: UserType;
}

const loginFormSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

const Login: React.FC<LoginProps> = ({ type }) => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(`${type}login with ${values.password} and ${values.username}`);
  }

  return (
    <>
      <NavBar title="登录" />
      <div className="justify-center ml-10 mr-10 mt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="用户名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="密码" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="flex">
              <Button type="submit">提交</Button>
              <div className="grow"></div>
              <Button type="button">注册</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default Login;
