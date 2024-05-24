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
import { useQuery } from "@tanstack/react-query";
import { dataFetch } from "shared";

export default function ReceptionOrderDetail({ roomId }: DetailProps) {
  function parseTimeString(timeString: string): string {
    const date = new Date(timeString);
    return date.toLocaleString("zh-CN");
  }

  const billQuery = useQuery({
    queryKey: ["receptionBill"],
    queryFn: async () => await dataFetch.getBillDetail(roomId),
  });
  console.log(billQuery.data);

  async function handleDownload() {
    if (!roomId) {
      alert("房间ID缺失,无法下载详单。");
      return;
    }
    const response = await fetch(`/api/room/bill-file?roomId=${roomId}`, {
      method: "GET",
    });
    if (!response.ok) {
      alert("下载失败，请稍后重试。");
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AC_Statement_${roomId}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  const shouldShow = roomId && billQuery.data;

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
                <DropdownMenuItem onSelect={handleDownload}>
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
              <Separator className="my-4" />
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">空调总费用</span>
                <span>￥ {billQuery.data?.statement.acTotalFee || 0}</span>
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
              <span className="text-muted-foreground">简餐费用</span>
              {Array.isArray(billQuery.data?.statement.bill) &&
                billQuery.data.statement.bill.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <span>
                      ￥ {item.price} × {item.quantity} = ￥ {item.subtotal}
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
