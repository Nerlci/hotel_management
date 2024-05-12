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
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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

const dateFormSchema = z.object({
  date: z.object({
    from: z.date(),
    to: z.date().optional(),
  }),
});
const checkinFormSchema = z.object({
  roomId: z.string(),
  dateRange: z.object({
    startDate: z.date(),
    endDate: z.date().optional(),
  }),
  userEmail: z.string().email(),
});

const CheckinForm = (props: {
  room: string;
  date: z.infer<typeof dateFormSchema>;
}) => {
  const form = useForm<z.infer<typeof checkinFormSchema>>({
    resolver: zodResolver(checkinFormSchema),
    defaultValues: {
      roomId: props.room,
      dateRange: {
        startDate: props.date.date.from,
        endDate: props.date.date.to,
      },
    },
  });
  function onSubmit(values: z.infer<typeof checkinFormSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-row items-center gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Label htmlFor="username">邮箱</Label>
        <FormField
          control={form.control}
          name="userEmail"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="" type="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="h-10">
          确认入住
        </Button>
      </form>
    </Form>
  );
};

const ReceptionCheckin = () => {
  const form = useForm<z.infer<typeof dateFormSchema>>({
    resolver: zodResolver(dateFormSchema),
    defaultValues: {
      date: {
        from: undefined,
        to: undefined,
      },
    },
  });
  const [rooms, setRooms] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const { logout } = useAuth()!;
  const mutation = useMutation({
    mutationFn: dataFetch.getRoomAvailable,
    onSuccess: (data) => {
      // console.log(data.payload);
      setRooms(data.payload.available);
      setSelectedRoom(data.payload.recommended);
    },
    onError: (error) => {
      console.log(error.message);
      if (error.message === "401") {
        logout();
      }
    },
  });
  const [submitted, setSubmitted] = useState<z.infer<
    typeof dateFormSchema
  > | null>(null);

  function onSubmit(values: z.infer<typeof dateFormSchema>) {
    setSubmitted(values);
    mutation.mutate({
      startDate: values.date.from.toISOString(),
      endDate: values.date.to
        ? values.date.to.toISOString()
        : values.date.from.toISOString(),
    });
  }

  return (
    <Card className="">
      <CardHeader className="flex h-24 flex-row">
        <CardTitle>办理入住</CardTitle>
        <div className="grow" />
        <Form {...form}>
          <form
            className="flex flex-row gap-3"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-1">
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
            </div>
            <Button
              type="submit"
              variant="outline"
              className="h-10"
              disabled={
                form.formState.errors.date !== undefined || mutation.isPending
              }
            >
              查询
            </Button>
          </form>
        </Form>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center gap-3">
          <CardTitle className="text-lg">选择房间</CardTitle>
          <Select disabled={rooms.length === 0}>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={
                  selectedRoom.length === 0 ? "选择房间" : selectedRoom
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {mutation.data &&
                  mutation.data.payload.available.map((roomId) => {
                    return (
                      <SelectItem key={roomId} value={roomId}>
                        {roomId}
                      </SelectItem>
                    );
                  })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="grow" />
          {selectedRoom.length === 0 ? (
            <p className="text-sm font-medium text-destructive">无可用房间</p>
          ) : (
            submitted && <CheckinForm room={selectedRoom} date={submitted} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function ReceptionCheckinCheckout() {
  return (
    <div className="flex flex-col gap-5">
      <ReceptionCheckin />
      <Card>
        <CardHeader>
          <CardTitle>管理房间</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={tasks}
            columns={columns}
            getDisplayName={getDisplayName}
            searchPlaceholder="搜索房间号..."
            filterableColumns={filterableColumns}
          />
        </CardContent>
      </Card>
    </div>
  );
}
