import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "./ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { dataFetch } from "shared";
import { Skeleton } from "./ui/skeleton";

const airconConfigForm = z
  .object({
    minTemperature: z.coerce.number().int(),
    maxTemperature: z.coerce.number().int(),
    rate: z.coerce.number(),
  })
  .refine((data) => {
    return data.minTemperature < data.maxTemperature;
  }, "最小值必须小于最大值")
  .refine((data) => {
    return data.rate >= 0.5 && data.rate <= 2.0;
  }, "费率必须在0.5到2.0之间");
type AirconConfigForm = z.infer<typeof airconConfigForm>;

export default function AirconConfig() {
  const form = useForm<AirconConfigForm>({
    resolver: zodResolver(airconConfigForm),
    defaultValues: {
      minTemperature: 18,
      maxTemperature: 30,
      rate: 1.0,
    },
  });
  const { logout } = useAuth()!;
  const tempQuery = useQuery({
    queryKey: ["airconTempRange"],
    queryFn: dataFetch.getAirconTempRange,
  });
  const rateQuery = useQuery({
    queryKey: ["airconPriceRate"],
    queryFn: dataFetch.getAirconPriceRate,
  });
  const submitMutation = useMutation({
    mutationFn: async (values: AirconConfigForm) => {
      await Promise.all([
        dataFetch.putAirconTempRange(
          values.minTemperature,
          values.maxTemperature,
        ),
        dataFetch.putAirconPriceRate(values.rate),
      ]);
    },
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
                <div className="mt-2 flex items-center gap-3">
                  <Label>最小</Label>
                  <div className="w-20">
                    {tempQuery.isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
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
                    )}
                  </div>
                  <Label className="ml-3">最大</Label>
                  <div className="w-20">
                    {tempQuery.isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
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
                    )}
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-xl">费率</Label>
                <div className="mt-2 flex items-center gap-3">
                  <div className="w-20">
                    {rateQuery.isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <FormField
                        control={form.control}
                        name="rate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder=""
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <label>(￥/kWh)</label>
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
