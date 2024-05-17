import {
  columns,
  filterableColumns,
  getDisplayName,
} from "@/lib/room-data/data";
import { DataTable } from "./DataTable/data-table";
import { Room } from "@/lib/room-data/schema";
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
import { useRef, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

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

const emailFormSchema = z.object({
  email: z.string().email(),
});

const ReceptionCheckin = () => {
  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });
  const [rooms, setRooms] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const userId = useRef("");
  const { logout } = useAuth()!;
  const mutation = useMutation({
    mutationFn: dataFetch.getReceptionCheckinableRooms,
    onSuccess: (data) => {
      // console.log(data.payload);
      if (data.payload.available.length === 0) {
        toast.info("无可用房间");
      } else {
        setRooms(data.payload.available);
        setSelectedRoom(data.payload.available[0]);
      }
    },
    onError: (error) => {
      if (error.message === "401") {
        logout();
      } else {
        console.log(error.message);
        toast.error("获取可用房间失败");
      }
    },
  });
  const checkEmailMutation = useMutation({
    mutationFn: dataFetch.getUserIdByEmail,
    onSuccess: (data) => {
      console.log(`userId: ${data}`);
      userId.current = data;
      mutation.mutate(data);
    },
    onError: (error) => {
      if (error.message === "401") {
        logout();
      } else {
        console.log(error.message);
        toast.error("根据邮箱查找用户失败");
      }
    },
  });
  const [submitted, setSubmitted] = useState("");

  function onSubmit(values: z.infer<typeof emailFormSchema>) {
    setSubmitted(values.email);
    // mutation.mutate(values.email);
    checkEmailMutation.mutate(values.email);
  }

  const checkinMutation = useMutation({
    mutationFn: dataFetch.postReceptionCheckin,
    onSuccess: () => {
      toast.success("入住成功");
    },
    onError: (error) => {
      console.log(error.message);
      toast.error("入住失败");
    },
  });

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
            <div className="flex flex-row items-center gap-2">
              <Label htmlFor="email">顾客邮箱</Label>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <Input type="email" placeholder="" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" variant="outline" className="h-10">
              查询
            </Button>
          </form>
        </Form>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center gap-3">
          <CardTitle className="text-lg">选择房间</CardTitle>
          <Select disabled={rooms.length === 0} onValueChange={setSelectedRoom}>
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
            submitted && (
              <Button
                type="submit"
                className="h-10"
                onClick={() => {
                  checkinMutation.mutate({
                    userId: userId.current,
                    roomId: selectedRoom,
                  });
                }}
              >
                确认入住
              </Button>
            )
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
