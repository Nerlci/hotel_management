import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { DetailProps } from "./ReceptionBill";
import { Skeleton } from "./ui/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { dataFetch } from "shared";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function ReceptionBillingDetail({ roomId }: DetailProps) {
  function parseTimeString(timeString: string): string {
    const date = new Date(timeString);
    return date.toLocaleString("zh-CN");
  }
  const billQuery = useQuery({
    queryKey: ["receptionBill", roomId],
    queryFn: async () => await dataFetch.getBillDetail(roomId),
    enabled: !!roomId,
  });
  const { logout } = useAuth()!;
  const fileMutation = useMutation({
    mutationFn: dataFetch.getBillDetailFile,
    onError: (e) => {
      if (e.message === "401") {
        logout();
      }
      console.log(e.message);
      toast.error("下载失败");
    },
    onSuccess: ({ blob, fileName }) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    },
  });

  const shouldShow = roomId && billQuery.data;
  const totalFee = billQuery.data?.statement.bill.reduce(
    (total, item) => total + item.subtotal,
    0,
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {shouldShow ? (
              <>{`${roomId} 房间账单`}</>
            ) : (
              <Skeleton className="mb-1 mt-1 h-5 w-52" />
            )}
          </CardTitle>
        </div>
        {shouldShow ? (
          <div className="ml-auto flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <MoreVertical className="h-3.5 w-3.5" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => {
                    fileMutation.mutate(roomId);
                  }}
                >
                  导出
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Skeleton className="ml-auto h-7 w-32" />
        )}
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          {shouldShow ? (
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">入住时间</span>
                <span>
                  {parseTimeString(billQuery.data?.statement.checkInDate || "")}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">离开时间</span>
                <span>
                  {parseTimeString(
                    billQuery.data?.statement.checkOutDate || "",
                  )}
                </span>
              </li>
            </ul>
          ) : (
            <>
              <Skeleton className="h-5 w-52" />
              <Skeleton className="h-5 w-52" />
            </>
          )}
          <Separator className="my-4" />
          {shouldShow ? (
            <ul className="grid gap-3">
              {Array.isArray(billQuery.data?.statement.bill) &&
                billQuery.data.statement.bill.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <span>
                      ￥ {item.price} × {item.quantity} = ￥{" "}
                      {item.subtotal.toFixed(2)}
                    </span>
                  </li>
                ))}
            </ul>
          ) : (
            <>
              <Skeleton className="h-5 w-52" />
              <Skeleton className="h-5 w-52" />
            </>
          )}
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">合计费用</span>
            <span>￥{totalFee}</span>
          </div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">地址</span>
              <span>北京市朝阳区朝阳路 37 号</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">电话</span>
              <span>010-12345678</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        {shouldShow ? (
          <div className="ml-auto text-xs text-muted-foreground">
            巴普特酒店
          </div>
        ) : (
          <Skeleton className="ml-auto h-4 w-36" />
        )}
      </CardFooter>
    </Card>
  );
}
