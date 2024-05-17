import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseQueryResult, useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import {
  DateRange as DateRangeType,
  UserRoomOrderResponse,
  dataFetch,
} from "shared";
import { toast } from "sonner";
import { z } from "zod";
import { Skeleton } from "./ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

const bookingFormSchema = z.object({
  date: z.object({
    from: z.date(),
    to: z.date().optional(),
  }),
});

function FormCard({ updateBookingQuery }: { updateBookingQuery: () => void }) {
  const bookingDateRange = useRef<DateRangeType | undefined>(undefined);
  const { logout } = useAuth()!;
  const book = useMutation({
    mutationFn: dataFetch.postRoomBooking,
    onSuccess: () => {
      toast.success("预定成功", {
        description: "您的预定已成功提交",
      });
      updateBookingQuery();
    },
    onError: (error) => {
      console.log(error.message);
      toast.error("预定失败");
      console.log(error.message);
      if (error.message === "401") {
        console.log("401");
        // logout();
      }
      // updateBookingQuery();
    },
  });
  const availability = useMutation({
    mutationFn: dataFetch.getRoomAvailability,
    onSuccess: (data) => {
      if (data.length === 0 && bookingDateRange.current !== undefined) {
        book.mutate(bookingDateRange.current);
      }
    },
    onError: (error) => {
      console.log(error.message);
      toast.error("获取房间可用性失败");
      if (error.message === "401") {
        logout();
      }
    },
  });
  const disabledDays = availability.data ?? [];

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
    const dateRange = DateRangeType.parse({
      startDate: values.date.from.toISOString(),
      endDate: values.date.to
        ? values.date.to.toISOString()
        : values.date.from.toISOString(),
    });
    bookingDateRange.current = dateRange;
    availability.mutate(dateRange);
  }

  return (
    <>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>填写必要信息</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-row flex-wrap items-center gap-3 space-x-7"
            >
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DatePickerWithRange
                        date={field.value}
                        // @ts-expect-error newVal is never a function
                        setDate={(newVal: DateRange | undefined) => {
                          if (newVal === undefined) {
                            return;
                          }
                          if (newVal.to === undefined) {
                            field.onChange(newVal);
                          } else {
                            if (newVal.from === undefined) {
                              // this should never happen
                              console.log("error: newVal.from is undefined");
                            } else {
                              const firstDisabledDay = findFirstDisabledDay(
                                newVal.from,
                                newVal.to,
                              );
                              if (firstDisabledDay === undefined) {
                                field.onChange(newVal);
                              } else {
                                if (newVal.from === field.value.from) {
                                  field.onChange({
                                    from: newVal.to,
                                    to: undefined,
                                  });
                                } else {
                                  field.onChange({
                                    from: newVal.from,
                                    to: undefined,
                                  });
                                }
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
                  </FormItem>
                )}
              />
              {form.formState.errors.date !== undefined ? (
                <p className="text-sm font-medium text-destructive">
                  需填写开始日期和结束日期
                </p>
              ) : disabledDays.length > 0 ? (
                <p className="text-sm font-medium text-destructive">
                  日期不可用
                </p>
              ) : (
                <></>
              )}
              <Button
                type="submit"
                className="h-8 w-[230px] sm:w-auto"
                disabled={
                  form.formState.errors.date !== undefined ||
                  disabledDays.length > 0
                }
              >
                提交
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

function DataCard({
  bookingQuery,
}: {
  bookingQuery: UseQueryResult<UserRoomOrderResponse, Error>;
}) {
  return (
    <Card className="ml-auto mr-auto mt-5">
      <CardHeader>
        <CardTitle>已预定信息</CardTitle>
      </CardHeader>
      <CardContent>
        {bookingQuery.isLoading ||
        bookingQuery.isRefetching ||
        !bookingQuery.data ? (
          <Skeleton className="h-5 w-32" />
        ) : bookingQuery.error || bookingQuery.isRefetchError ? (
          <div className="text-destructive">获取预定信息失败</div>
        ) : bookingQuery.data?.payload.startDate === "" ? (
          <p>暂无预定</p>
        ) : (
          <p>
            {new Date(
              bookingQuery.data?.payload.startDate,
            ).toLocaleDateString()}{" "}
            -{" "}
            {new Date(bookingQuery.data?.payload.endDate).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export const CustomerBooking = ({
  bookingQuery,
}: {
  bookingQuery: UseQueryResult<UserRoomOrderResponse, Error>;
}) => {
  return (
    <>
      <FormCard updateBookingQuery={bookingQuery.refetch} />
      <DataCard bookingQuery={bookingQuery} />
    </>
  );
};
