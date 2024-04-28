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
  MAX_AIRCON_SPEED,
  MAX_AIRCON_TEMP,
  MIN_AIRCON_SPEED,
  MIN_AIRCON_TEMP,
} from "shared";
import AirConditionerIcon from "../assets/aircon.svg";
import { Switch } from "./ui/switch";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useSSE } from "@/hooks/useSse";
// import { BASE_URL } from "@/lib/dataFetch";
// import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useTempEmulate } from "@/lib/tempEmulate";

export function AirconDrawer() {
  const [temperature, setTemperature] = useLocalStorage("temperature", 24);
  const [windspeed, setwindspeed] = useLocalStorage("windspeed", 1);
  const [start, setstart] = useLocalStorage("start", false);
  const [cool, setcool] = useLocalStorage("cool", true);
  const currentTemp = useTempEmulate({
    startTemp: 10,
    targetTemp: temperature,
    windSpeed: windspeed,
    mode: cool ? "cool" : "heat",
    start: start,
  });

  // const { sseData, sseReadyState, closeSource } = useSSE<{
  //   data: string;
  // }>(`${BASE_URL}/api/ac/status`);

  // useEffect(() => closeSource, [closeSource]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="w-70 h-14" variant="outline">
          <div className="flex flex-initial flex-row gap-5">
            <img
              className="pointer-events-none w-10 select-none invert-0 dark:invert"
              src={AirConditionerIcon}
            />
            <div
              className={`flex flex-row flex-wrap items-center justify-center gap-1 ${start ? "" : "text-zinc-700"}`}
            >
              <p className="w-28">目标温度：{temperature}&deg;C</p>
              <p className="w-24">目标风速：{windspeed}</p>
              <p className="w-28">当前温度：{currentTemp}&deg;C</p>
              {/*sseReadyState.key === 0 ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                <div>{sseData && sseData.data}</div>
              )*/}
            </div>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <div className="flex flex-row">
              <div className="flex flex-col gap-2">
                <DrawerTitle className="text-left">控制空调</DrawerTitle>
                <DrawerDescription>
                  您的空调使用会产生额外计费
                </DrawerDescription>
              </div>
              <div className="grow" />
              启动
              <Switch
                className="ml-2"
                checked={start}
                onCheckedChange={setstart}
              />
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
                <div className={`${start ? "" : "text-zinc-700"}`}>
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
                    Math.max(
                      MIN_AIRCON_TEMP,
                      Math.min(MAX_AIRCON_TEMP, prev - 1),
                    ),
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
                  className={`text-[1.2rem] text-muted-foreground ${start ? "" : "text-zinc-700"}`}
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
                    Math.max(
                      MIN_AIRCON_TEMP,
                      Math.min(MAX_AIRCON_TEMP, prev + 1),
                    ),
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
                  className={`text-[1.2rem] text-muted-foreground ${start ? "" : "text-zinc-700"}`}
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
            <Button>提交</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
