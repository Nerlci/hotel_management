import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "./ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const airconConfigForm = z
  .object({
    minTemperature: z.coerce.number().int(),
    maxTemperature: z.coerce.number().int(),
    minWindspeed: z.coerce.number().int(),
    maxWindspeed: z.coerce.number().int(),
  })
  .refine((data) => {
    return (
      data.minTemperature < data.maxTemperature &&
      data.minWindspeed < data.maxWindspeed
    );
  }, "最小值必须小于最大值");
type AirconConfigForm = z.infer<typeof airconConfigForm>;

export default function AirconConfig() {
  const form = useForm<AirconConfigForm>({
    resolver: zodResolver(airconConfigForm),
    defaultValues: {
      minTemperature: 18,
      maxTemperature: 30,
      minWindspeed: 1,
      maxWindspeed: 3,
    },
  });
  const { logout } = useAuth()!;
  const submitMutation = useMutation({
    mutationFn: async (values: AirconConfigForm) =>
      console.log(JSON.stringify(values)),
    onError: (error) => {
      if (error.message === "401") {
        logout();
      }
    },
    onSuccess: () => {
      toast.success("保存成功");
    },
  });
  function onSubmit(values: AirconConfigForm) {
    submitMutation.mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>空调配置</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-10">
              <div className="">
                <Label className="text-xl">温度</Label>
                <div className="flex items-center gap-3">
                  <Label>最小</Label>
                  <div className="w-20">
                    <FormField
                      control={form.control}
                      name="minTemperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Label className="ml-3">最大</Label>
                  <div className="w-20">
                    <FormField
                      control={form.control}
                      name="maxTemperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-xl">风速</Label>
                <div className="flex items-center gap-3">
                  <Label>最小</Label>
                  <div className="w-20">
                    <FormField
                      control={form.control}
                      name="minWindspeed"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Label className="ml-3">最大</Label>
                  <div className="w-20">
                    <FormField
                      control={form.control}
                      name="maxWindspeed"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="grow" />
              {
                //@ts-expect-error who did this ???
                form.formState.errors[""] !== undefined && (
                  <p className="text-sm font-medium text-destructive">
                    {
                      //@ts-expect-error who did this ???
                      form.formState.errors[""].message
                    }
                  </p>
                )
              }
              <Button className="h-8" type="submit">
                保存
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
