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
  MIN_AIRCON_SPEED,
  dataFetch,
} from "shared";
import AirConditionerIcon from "../assets/aircon.svg";
import { Switch } from "./ui/switch";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const AirconDrawerContent = ({
  sseData,
  onUserUpdate,
  controlled = true, // controlled is set to false when the drawer is opened by ac-manager
  tempRange,
}: {
  sseData: ACStatus;
  onUserUpdate: (
    temperature: number,
    windspeed: number,
    cool: boolean,
    start: boolean,
  ) => void;
  controlled: boolean;
  tempRange: {
    minTarget: number;
    maxTarget: number;
  };
}) => {
  const [temperature, setTemperature] = useState(sseData.target);
  const [windspeed, setWindspeed] = useState(sseData.fanSpeed);
  const [start, setstart] = useState(sseData.on);
  const [cool, setcool] = useState(sseData.mode === 1);
  const [mode, setMode] = useState<"cool" | "warm" | "auto">("auto");

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
          <Select
            defaultValue={mode}
            onValueChange={(value) => {
              if (value !== "cool" && value !== "warm" && value !== "auto") {
                toast.error("无效的模式");
              } else {
                setMode(value);
                if (value === "cool") {
                  setcool(true);
                } else if (value === "warm") {
                  setcool(false);
                }
              }
            }}
            // disabled={!start}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="cool">模式：制冷</SelectItem>
                <SelectItem value="warm">模式：制热</SelectItem>
                <SelectItem value="auto">模式：自动</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex flex-row items-center gap-3">
            <div
              className={`flex flex-row gap-1 text-[1.2rem] ${
                start
                  ? !cool
                    ? "text-orange-500"
                    : "text-blue-500"
                  : "text-muted"
              }`}
            >
              <div
                className={`h-10 w-10 rounded-full ${
                  start
                    ? !cool
                      ? "bg-orange-500/10"
                      : "bg-blue-500/10"
                    : "text-muted"
                }`}
              >
                {!cool ? (
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
            // TODO: edge case when temperature is not in [min, max]
            defaultValue={[temperature]}
            max={tempRange.maxTarget}
            min={tempRange.minTarget}
            step={1}
            disabled={!start}
            onValueChange={(value) => {
              setTemperature(value[0]);
              if (mode === "auto") {
                if (value[0] < sseData.temp) {
                  setcool(true);
                } else {
                  setcool(false);
                }
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
            sseData.waiting === true ||
            (controlled &&
              temperature === sseData.temp &&
              windspeed === sseData.fanSpeed &&
              cool === (sseData.mode === 1) &&
              start === sseData.on)
          }
          onClick={() => {
            onUserUpdate(temperature, windspeed, cool, start);
          }}
        >
          {sseData.waiting ? (
            <div role="status" className="flex flex-row items-center gap-3">
              <svg
                aria-hidden="true"
                className="h-5 w-5 animate-spin fill-black text-white dark:fill-gray-100 dark:text-gray-800"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="">Loading...</span>
            </div>
          ) : (
            "确认"
          )}
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
  const tempRangeQuery = useQuery({
    queryKey: ["tempRange"],
    queryFn: dataFetch.getACTargetRange,
  });
  const tempRange = tempRangeQuery.data;
  const loading =
    sseData === undefined || sseReadyState.key !== 1 || tempRange === undefined;

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
                    {loading ? (
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
        {!loading && (
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
            controlled={false}
            tempRange={tempRange}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}
