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
import { DetailProps } from "./ReceptionBill";
import { Skeleton } from "./ui/skeleton";
import { dataFetch } from "shared";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function ReceptionOrderDetail({ roomId }: DetailProps) {
  const acDetailQuery = useQuery({
    queryKey: ["acDetail"],
    queryFn: async () => await dataFetch.getACDetail(roomId),
    enabled: !!roomId,
  });

  function parseTimeString(timeString: string): string {
    const date = new Date(timeString);
    return date.toLocaleString("zh-CN");
  }

  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let timeString = "";
    if (hours > 0) {
      timeString += `${hours}h `;
    }
    if (minutes > 0) {
      timeString += `${minutes}m `;
    }
    timeString += `${remainingSeconds}s`;

    return timeString;
  }

  function calculateTotal() {
    if (Array.isArray(acDetailQuery.data?.statement)) {
      return acDetailQuery.data.statement.reduce(
        (total, detail) => total + detail.price,
        0,
      );
    }
    return 0;
  }
  const { logout } = useAuth()!;
  const fileMutation = useMutation({
    mutationFn: dataFetch.getACDetailFile,
    onError: (e) => {
      if (e.message === "401") {
        logout();
      }
      console.log(e.message);
      toast.error("下载失败");
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `详单_${roomId}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    },
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {roomId ? (
              <>{`${roomId} 房间空调使用详单`}</>
            ) : (
              <Skeleton className="mb-1 mt-1 h-5 w-52" />
            )}
          </CardTitle>
        </div>
        {roomId ? (
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
                  导出 csv
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
          {roomId && acDetailQuery.data ? (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed text-left">
                <thead>
                  <tr>
                    <th className="p-2">请求时间</th>
                    <th className="p-2">服务开始时间</th>
                    <th className="p-2">服务结束时间</th>
                    <th className="p-2">服务时长</th>
                    <th className="p-2">风速</th>
                    <th className="p-2">设定温度</th>
                    <th className="p-2">房间温度</th>
                    <th className="p-2">费率</th>
                    <th className="p-2">小计</th>
                  </tr>
                </thead>
                <tbody>
                  {acDetailQuery.data.statement.map((detail, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">
                        {detail.requestTime &&
                          parseTimeString(detail.requestTime)}
                      </td>
                      <td className="p-2">
                        {parseTimeString(detail.startTime)}
                      </td>
                      <td className="p-2">{parseTimeString(detail.endTime)}</td>
                      <td className="p-2">{formatTime(detail.duration)}</td>
                      <td className="p-2">{detail.fanSpeed} 级</td>
                      <td className="p-2">{detail.target} ℃</td>
                      <td className="p-2">{detail.temp.toFixed(2)} ℃</td>
                      <td className="p-2">￥{detail.priceRate}</td>
                      <td className="p-2">￥{detail.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </>
          )}
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">合计费用</span>
            <span>￥{calculateTotal().toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-6"></div>
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
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        {roomId ? (
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
