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
import {
  FanIcon,
  ThermometerSnowflakeIcon,
  ThermometerSunIcon,
} from "lucide-react";
import {
  ACStatus,
  MAX_AIRCON_SPEED,
  MAX_AIRCON_TEMP,
  MIN_AIRCON_SPEED,
  MIN_AIRCON_TEMP,
  dataFetch,
} from "shared";
import AirConditionerIcon from "../assets/aircon.svg";
import { Switch } from "./ui/switch";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TempSlider, WindSlider } from "./AirconSlider";
import { useAuth } from "@/hooks/useAuth";
import { useSSE } from "@/hooks/useSSE";
import { useTempEmulate } from "@/hooks/tempEmulate";

export const AirconDrawerContent = ({
  sseData,
  onUserUpdate,
  controlled = true, // controlled is set to false when the drawer is opened by ac-manager
}: {
  sseData: ACStatus;
  onUserUpdate: (
    temperature: number,
    windspeed: number,
    cool: boolean,
    start: boolean,
  ) => void;
  controlled: boolean;
}) => {
  const [temperature, setTemperature] = useState(sseData.target);
  const [windspeed, setWindspeed] = useState(sseData.fanSpeed);
  const [start, setstart] = useState(sseData.on);
  const [cool, setcool] = useState(sseData.mode === 1);

  // start state could change from outside when drawer is open
  useEffect(() => {
    if (controlled) {
      setstart(sseData.on);
    }
  }, [sseData, controlled]);

  return (
    <div className="mx-auto w-full max-w-sm">
      <DrawerHeader>
        <div className="flex flex-row">
          <div className="flex flex-col gap-2">
            <DrawerTitle className="text-left">控制空调</DrawerTitle>
            {controlled && (
              <DrawerDescription>您的空调使用会产生额外计费</DrawerDescription>
            )}
          </div>
          <div className="grow" />
          启动
          <Switch className="ml-2" checked={start} onCheckedChange={setstart} />
        </div>
      </DrawerHeader>
      <div className="p-4 pb-0">
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-row items-center gap-3">
            <div
              className={`flex flex-row gap-1 text-[1.2rem] ${
                start
                  ? temperature > sseData.temp
                    ? "text-orange-500"
                    : "text-blue-500"
                  : "text-muted"
              }`}
            >
              <div
                className={`h-10 w-10 rounded-full ${
                  start
                    ? temperature > sseData.temp
                      ? "bg-orange-500/10"
                      : "bg-blue-500/10"
                    : "text-muted"
                }`}
              >
                {temperature > sseData.temp ? (
                  <ThermometerSunIcon className="mx-auto mt-2" />
                ) : (
                  <ThermometerSnowflakeIcon className="mx-auto mt-2" />
                )}
              </div>
            </div>
            <div className="grow" />
            <div className="flex items-center justify-center space-x-2">
              <div
                className={`flex w-28 items-center justify-center gap-1 text-5xl font-bold tracking-tighter ${
                  start ? "" : "text-muted"
                }`}
              >
                {temperature}
                <div className="text-4xl">&deg;C</div>
              </div>
            </div>
          </div>
          <TempSlider
            className="w-full"
            defaultValue={[temperature]}
            max={MAX_AIRCON_TEMP}
            min={MIN_AIRCON_TEMP}
            step={1}
            disabled={!start}
            onValueChange={(value) => {
              setTemperature(value[0]);
              if (value[0] < sseData.temp) {
                setcool(true);
              } else {
                setcool(false);
              }
            }}
          />
        </div>
        <div className="mt-8" />
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-row items-center gap-3">
            <div
              className={`flex flex-row gap-1 text-[1.2rem] ${
                start ? "text-green-500" : "text-muted"
              }`}
            >
              <div
                className={`h-10 w-10 rounded-full ${
                  start ? "bg-green-500/10" : "text-muted"
                }`}
              >
                <FanIcon
                  className="mx-auto mt-2 animate-spin"
                  style={{
                    transform: "scale(-1, -1)",
                    animation: `spin ${start ? 1 : 0}s linear infinite`,
                    // this line works fine, but causes a warning
                    // animationDuration: `${2 / (1.5 * windspeed)}s`,
                  }}
                />
              </div>
            </div>
            <div className="grow" />
            <div className="flex items-center justify-center space-x-2">
              <div
                className={`flex w-28 items-center justify-center gap-1 text-5xl font-bold tracking-tighter ${
                  start ? "" : "text-muted"
                }`}
              >
                {windspeed}
              </div>
            </div>
          </div>
          <WindSlider
            className="w-full"
            defaultValue={[windspeed]}
            max={MAX_AIRCON_SPEED}
            min={MIN_AIRCON_SPEED}
            step={1}
            disabled={!start}
            onValueChange={(value) => {
              setWindspeed(value[0]);
            }}
          />
        </div>
      </div>
      <DrawerFooter>
        <Button
          disabled={
            controlled &&
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

export default function AirconDrawer(props: { roomId: string }) {
  const { sseData, sseReadyState, closeSource } = useSSE<ACStatus>(
    `${dataFetch.BASE_URL}/api/ac/status?roomId=${props.roomId}`,
  );
  useEffect(() => closeSource, [closeSource]);
  const { logout } = useAuth()!;
  const mutation = useMutation({
    mutationFn: dataFetch.postUserAirconUpdate,
    onSuccess: () => {
      toast.success("空调状态更改成功");
    },
    onError: (error) => {
      if (error.message === "401") {
        toast("请重新登录", {
          description: "登录状态已过期",
        });
        logout();
      }
      toast.error("空调状态更改失败");
      console.log(error.message);
    },
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const currentTemp = useTempEmulate({
    startTemp: sseData?.temp || 25,
    on: sseData?.on || false,
    temp: sseData?.temp || 25,
    rate: sseData?.rate || 0.1,
    initTemp: sseData?.initTemp || 30,
    timestamp: sseData ? new Date(sseData.timestamp) : new Date(),
  });

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <Button
          className="h-32 w-full min-[409px]:h-14 lg:max-w-[21rem]"
          variant="outline"
          disabled={sseReadyState.key !== 1}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex w-full flex-initial flex-row items-center gap-5">
                  <img
                    className="pointer-events-none w-10 select-none invert-0 dark:invert"
                    src={AirConditionerIcon}
                  />
                  <div className="grow" />
                  <div
                    className={`flex max-w-[14rem] flex-row flex-wrap items-center justify-center gap-1 text-right ${sseData?.on ? "" : "text-muted-foreground"}`}
                  >
                    {sseData === undefined || sseReadyState.key !== 1 ? (
                      <Skeleton className="h-5 w-40" />
                    ) : (
                      <>
                        <p className="w-28">
                          目标温度：{sseData?.target}&deg;C
                        </p>
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
                roomId: props.roomId,
                target: temperature,
                fanSpeed: windspeed,
                mode: cool ? 1 : 0,
                on: start,
              });
              setDrawerOpen(false);
            }}
            controlled
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}
