import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

const bookingFormSchema = z.object({
  date: z.object({
    from: z.date(),
    to: z.date(),
  }),
  email: z.string().email(),
});

export const CustomerBooking = () => {
  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      date: {
        from: new Date(),
        to: addDays(new Date(), 1),
      },
    },
  });

  function onSubmit(values: z.infer<typeof bookingFormSchema>) {
    console.log(JSON.stringify(values));
  }

  return (
    <>
      <NavBar title={"预定"} />
      <Card className="w-11/12 ml-auto mr-auto mt-10">
        <CardHeader>
          <CardTitle>填写必要信息</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 w-80"
            >
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DatePickerWithRange
                        date={field.value}
                        setDate={field.onChange}
                        className="w-[300px]"
                      />
                    </FormControl>
                    {form.formState.errors.date !== undefined ? (
                      <p className="text-sm font-medium text-destructive">
                        需填写开始日期和结束日期
                      </p>
                    ) : (
                      <></>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="邮箱"
                        className="w-[300px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="h-8"
                disabled={form.formState.errors.date !== undefined}
              >
                提交
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
