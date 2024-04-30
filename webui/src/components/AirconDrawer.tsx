import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Minus, Plus } from "lucide-react";
import {
  ACStatus,
  MAX_AIRCON_SPEED,
  MAX_AIRCON_TEMP,
  MIN_AIRCON_SPEED,
  MIN_AIRCON_TEMP,
} from "shared";
import AirConditionerIcon from "../assets/aircon.svg";
import { Switch } from "./ui/switch";
import { useSSE } from "@/hooks/useSse";
import { BASE_URL, postUserAirconUpdate } from "@/lib/dataFetch";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTempEmulate } from "@/lib/tempEmulate";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AirconDrawerContent = ({
  sseData,
  onUserUpdate,
}: {
  sseData: ACStatus;
  onUserUpdate: (
    temperature: number,
    windspeed: number,
    cool: boolean,
    start: boolean,
  ) => void;
}) => {
  const [temperature, setTemperature] = useState(sseData.temp);
  const [windspeed, setwindspeed] = useState(sseData.fanSpeed);
  const [start, setstart] = useState(sseData.on);
  const [cool, setcool] = useState(sseData.mode === 1);

  // start state could change from outside when drawer is open
  useEffect(() => {
    setstart(sseData.on);
  }, [sseData, setstart]);

  return (
    <div className="mx-auto w-full max-w-sm">
      <DrawerHeader>
        <div className="flex flex-row">
          <div className="flex flex-col gap-2">
            <DrawerTitle className="text-left">控制空调</DrawerTitle>
            <DrawerDescription>您的空调使用会产生额外计费</DrawerDescription>
          </div>
          <div className="grow" />
          启动
          <Switch className="ml-2" checked={start} onCheckedChange={setstart} />
        </div>
      </DrawerHeader>
      <div className="p-4 pb-0">
        <div className="flex items-center justify-center space-x-2">
          <div className="flex w-full justify-start gap-4">
            <Switch
              className="ml-2 data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-orange-500"
              checked={cool}
              onCheckedChange={setcool}
              disabled={!start}
            />
            <div className={`${start ? "" : "text-muted"}`}>
              {cool ? "制冷" : "制热"}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => {
              setTemperature((prev) =>
                Math.max(MIN_AIRCON_TEMP, Math.min(MAX_AIRCON_TEMP, prev - 1)),
              );
            }}
            disabled={temperature <= MIN_AIRCON_TEMP || !start}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <div className="flex-1 text-center">
            <div
              className={`flex items-center justify-center gap-1 text-7xl font-bold tracking-tighter ${start ? "" : "text-muted"}`}
            >
              {temperature}
              <div className="text-4xl">&deg;C</div>
            </div>
            <div
              className={`text-[1.2rem] text-muted-foreground ${start ? "" : "text-muted"}`}
            >
              目标温度
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => {
              setTemperature((prev) =>
                Math.max(MIN_AIRCON_TEMP, Math.min(MAX_AIRCON_TEMP, prev + 1)),
              );
            }}
            disabled={temperature >= MAX_AIRCON_TEMP || !start}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
        <div className="mt-8" />
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => {
              setwindspeed((prev) =>
                Math.max(
                  MIN_AIRCON_SPEED,
                  Math.min(MAX_AIRCON_SPEED, prev - 1),
                ),
              );
            }}
            disabled={windspeed <= MIN_AIRCON_SPEED || !start}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <div className="flex-1 text-center">
            <div
              className={`text-7xl font-bold tracking-tighter ${start ? "" : "text-muted"}`}
            >
              {windspeed}
            </div>
            <div
              className={`text-[1.2rem] text-muted-foreground ${start ? "" : "text-muted"}`}
            >
              目标风速
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => {
              setwindspeed((prev) =>
                Math.max(
                  MIN_AIRCON_SPEED,
                  Math.min(MAX_AIRCON_SPEED, prev + 1),
                ),
              );
            }}
            disabled={windspeed >= MAX_AIRCON_SPEED || !start}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <DrawerFooter>
        <Button
          disabled={
            temperature === sseData.temp &&
            windspeed === sseData.fanSpeed &&
            cool === (sseData.mode === 1) &&
            start === sseData.on
          }
          onClick={() => {
            onUserUpdate(temperature, windspeed, cool, start);
          }}
        >
          提交
        </Button>
      </DrawerFooter>
    </div>
  );
};

export function AirconDrawer() {
  const { sseData, sseReadyState, closeSource } = useSSE<ACStatus>(
    `${BASE_URL}/api/ac/status?roomId=${8103}`,
  );
  useEffect(() => closeSource, [closeSource]);
  const currentTemp = useTempEmulate({
    startTemp: 10,
    targetTemp: sseData?.temp ?? 24,
    windSpeed: sseData?.fanSpeed ?? 1,
    mode: sseData?.mode === 1 ? "cool" : "heat",
    start: sseData?.on ?? false,
    onTempTied: () => {
      // close aircon if current temp is the same as target temp
      if (sseData) {
        if (currentTemp === sseData.temp && sseData.on) {
          mutation.mutate({
            ...sseData,
            on: false,
          });
        }
      }
    },
  });
  const mutation = useMutation({
    mutationFn: postUserAirconUpdate,
    onSuccess: () => {
      toast("空调状态更改成功");
    },
    onError: (error) => {
      toast(error.message, {
        description: "空调状态更改失败",
      });
    },
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <Button
          className="h-14 max-w-[20rem]"
          variant="outline"
          disabled={sseReadyState.key !== 1}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex w-full max-w-[20rem] flex-initial flex-row gap-5">
                  <img
                    className="pointer-events-none w-10 select-none invert-0 dark:invert"
                    src={AirConditionerIcon}
                  />
                  <div
                    className={`flex flex-row flex-wrap items-center justify-center gap-1 ${sseData?.on ? "" : "text-muted-foreground"}`}
                  >
                    {sseReadyState.key !== 1 ? (
                      <Skeleton className="h-5 w-40" />
                    ) : (
                      <>
                        <p className="w-28">目标温度：{sseData?.temp}&deg;C</p>
                        <p className="w-24">目标风速：{sseData?.fanSpeed}</p>
                        <p className="w-28">当前温度：{currentTemp}&deg;C</p>
                        <p className="w-24">
                          模式：{sseData?.mode === 0 ? "制热" : "制冷"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="mb-2">
                <p>控制空调</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        {sseData && (
          <AirconDrawerContent
            sseData={sseData}
            onUserUpdate={(temperature, windspeed, cool, start) => {
              mutation.mutate({
                roomId: "8103",
                temp: temperature,
                fanSpeed: windspeed,
                mode: cool ? 1 : 0,
                on: start,
              });
              setDrawerOpen(false);
            }}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}
