import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  MAX_AIRCON_SPEED,
  MAX_AIRCON_TEMP,
  MIN_AIRCON_SPEED,
  MIN_AIRCON_TEMP,
} from "shared";
import AirConditionerIcon from "../assets/aircon.svg";

export function AirconDrawer() {
  const [tempreture, settempreture] = useState(24);
  const [windspeed, setwindspeed] = useState(1);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="h-14 w-20" variant="outline">
          <img
            className="w-10 invert-0 dark:invert select-none pointer-events-none"
            src={AirConditionerIcon}
          />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>控制空调</DrawerTitle>
            <DrawerDescription>您的空调使用会产生额外计费</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => {
                  settempreture((prev) =>
                    Math.max(
                      MIN_AIRCON_TEMP,
                      Math.min(MAX_AIRCON_TEMP, prev - 1),
                    ),
                  );
                }}
                disabled={tempreture <= MIN_AIRCON_TEMP}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {tempreture}
                </div>
                <div className="text-[1.2rem] text-muted-foreground">
                  目标温度
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => {
                  settempreture((prev) =>
                    Math.max(
                      MIN_AIRCON_TEMP,
                      Math.min(MAX_AIRCON_TEMP, prev + 1),
                    ),
                  );
                }}
                disabled={tempreture >= MAX_AIRCON_TEMP}
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
                disabled={windspeed <= MIN_AIRCON_SPEED}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {windspeed}
                </div>
                <div className="text-[1.2rem] text-muted-foreground">
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
                disabled={windspeed >= MAX_AIRCON_SPEED}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
          </div>
          <DrawerFooter>
            <Button>提交</Button>
            <DrawerClose asChild>
              <Button variant="outline">取消</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
