import { Copy, MoreVertical, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { DetailProps } from "./ReceptionBill";
import { Skeleton } from "./ui/skeleton";

export default function ReceptionBillingDetail({ roomId }: DetailProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {roomId ? (
              <>
                {`${roomId} 房间详单`}
                <Button
                  size="icon"
                  variant="outline"
                  className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Copy className="h-3 w-3" />
                  <span className="sr-only">Copy Order ID</span>
                </Button>
              </>
            ) : (
              <Skeleton className="mb-1 mt-1 h-5 w-52" />
            )}
          </CardTitle>
          {roomId ? (
            <CardDescription className="flex justify-between gap-4">
              <span>2024-05-15 11:05</span>
              <span>账单号:000293</span>
              <span>结账员:王丽</span>
            </CardDescription>
          ) : (
            <Skeleton className="mb-1 mt-1 h-3 w-20" />
          )}
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
                <DropdownMenuItem>编辑</DropdownMenuItem>
                <DropdownMenuItem>导出</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>删除</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Skeleton className="ml-auto h-7 w-32" />
        )}
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">住宿费明细</div>
          {roomId ? (
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  标准间 x <span>1</span>
                </span>
                <span>￥250.00</span>
              </li>
            </ul>
          ) : (
            <>
              <Skeleton className="h-5 w-52" />
              <Skeleton className="h-5 w-52" />
            </>
          )}
          <Separator className="my-4" />
          <div className="font-semibold">餐饮费明细</div>
          {roomId ? (
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">健康轻食早餐 x 1</span>
                <span>￥20.00</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">家庭式晚餐套餐 x 1</span>
                <span>￥140.00</span>
              </li>
            </ul>
          ) : (
            <>
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
            </>
          )}
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">空调费明细</div>
          {roomId ? (
            <ul className="grid gap-3">
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">
                  0:00 - 7:00 设定温度:24°C 风速:低
                </span>
                <span>￥3.00</span>
              </li>
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">
                  10:00 - 12:00 设定温度:24°C 风速:中
                </span>
                <span>￥1.20</span>
              </li>
            </ul>
          ) : (
            <>
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-28" />
            </>
          )}
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          {roomId ? (
            <ul className="grid gap-3">
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">总费用</span>
                <span>￥414.20</span>
              </li>
            </ul>
          ) : (
            <>
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
            </>
          )}
        </div>
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
