import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { useForm } from "react-hook-form";
import { DateRange } from "shared";
import { z } from "zod";

const bookingFormSchema = z.object({
  date: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

export const CustomerBooking = () => {
  const disabledDays: Date[] = [
    new Date(),
    addDays(new Date(), 1),
    new Date(2024, 4, 3),
  ];
  // TODO: fetch disabledDays from server

  function findFirstDisabledDay(from: Date, to: Date): Date | undefined {
    for (let i = 0; i < disabledDays.length; i++) {
      const disabledDay = disabledDays[i];
      if (disabledDay > from && disabledDay <= to) {
        return disabledDay;
      }
    }
    return undefined;
  }

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      date: {
        // from: new Date(),
        // to: addDays(new Date(), 1),
        from: undefined,
        to: undefined,
      },
    },
  });

  function onSubmit(values: z.infer<typeof bookingFormSchema>) {
    const dateRange = DateRange.parse({
      startDate: values.date.from,
      endDate: values.date.to,
    });
    console.log(JSON.stringify(dateRange));
    // TODO: post dateRange to server
  }

  return (
    <>
      <NavBar title={"预定"} />
      <Card className="ml-auto mr-auto mt-10 w-11/12">
        <CardHeader>
          <CardTitle>填写必要信息</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-80 space-y-2"
            >
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DatePickerWithRange
                        date={field.value}
                        setDate={(newVal) => {
                          // @ts-ignore
                          if (newVal.to === undefined) {
                            field.onChange(newVal);
                          } else {
                            // @ts-ignore
                            const firstDisabledDay = findFirstDisabledDay(
                              // @ts-ignore
                              newVal.from,
                              // @ts-ignore
                              newVal.to,
                            );
                            if (firstDisabledDay === undefined) {
                              field.onChange(newVal);
                            } else {
                              // @ts-ignore
                              if (newVal.from === field.value.from) {
                                field.onChange({
                                  // @ts-ignore
                                  from: newVal.to,
                                  to: undefined,
                                });
                              } else {
                                field.onChange({
                                  // @ts-ignore
                                  from: newVal.from,
                                  to: undefined,
                                });
                              }
                            }
                          }
                        }}
                        disabledDays={[
                          {
                            before: new Date(),
                          },
                          ...disabledDays,
                        ]}
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
