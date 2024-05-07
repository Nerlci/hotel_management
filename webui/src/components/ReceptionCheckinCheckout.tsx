import {
  columns,
  filterableColumns,
  getDisplayName,
} from "@/lib/room-data/data";
import { DataTable } from "./DataTable/data-table";
import { Room } from "@/lib/room-data/schema";
import { DatePickerWithRange } from "./DatePickerWithRange";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { dataFetch } from "shared";

const tasks: Room[] = [
  {
    id: "1001",
    status: "occupied",
    startDate: new Date(2024, 0, 1).toLocaleString().split(" ")[0],
    endDate: new Date(2024, 0, 2).toLocaleString().split(" ")[0],
  },
  {
    id: "1002",
    status: "empty",
    startDate: "-",
    endDate: "-",
  },
  {
    id: "1003",
    status: "occupied",
    startDate: new Date(2024, 0, 4).toLocaleString().split(" ")[0],
    endDate: new Date(2024, 0, 5).toLocaleString().split(" ")[0],
  },
  {
    id: "2001",
    status: "occupied",
    startDate: new Date(2024, 0, 5).toLocaleString().split(" ")[0],
    endDate: new Date(2024, 0, 6).toLocaleString().split(" ")[0],
  },
];

const checkinFormSchema = z.object({
  date: z.object({
    from: z.date(),
    to: z.date().optional(),
  }),
});

export default function ReceptionCheckinCheckout() {
  const form = useForm<z.infer<typeof checkinFormSchema>>({
    resolver: zodResolver(checkinFormSchema),
    defaultValues: {
      date: {
        from: undefined,
        to: undefined,
      },
    },
  });
  const mutation = useMutation({
    mutationFn: dataFetch.getRoomAvailable,
    onSuccess: (data) => {
      console.log(data.payload);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  function onSubmit(values: z.infer<typeof checkinFormSchema>) {
    mutation.mutate({
      startDate: values.date.from.toISOString(),
      endDate: values.date.to
        ? values.date.to.toISOString()
        : values.date.from.toISOString(),
    });
  }

  return (
    <div>
      <div className="my-3 flex flex-row items-center gap-3">
        <h2>查询空房</h2>
        <Form {...form}>
          <form
            className="flex flex-row items-center gap-1"
            onSubmit={form.handleSubmit(onSubmit)}
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
                      disabledDays={[]}
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
            ) : (
              <></>
            )}
            <Button
              type="submit"
              className="h-8"
              disabled={
                form.formState.errors.date !== undefined || mutation.isPending
              }
            >
              提交
            </Button>
          </form>
        </Form>
        {mutation.data &&
          mutation.data.payload.available.map((roomId) => {
            return <p key={roomId}>{roomId}</p>;
          })}
      </div>
      <DataTable
        data={tasks}
        columns={columns}
        getDisplayName={getDisplayName}
        searchPlaceholder="搜索房间号..."
        filterableColumns={filterableColumns}
      />
    </div>
  );
}
