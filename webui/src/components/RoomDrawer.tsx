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
import RoomIcon from "../assets/bed.svg";
import { useEffect, useState } from "react";
import { DatePicker } from "./DatePicker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function RoomDrawer() {
  const [date, setdate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    // TODO: post to server
  }, [date]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="h-14 w-full lg:w-60" variant="outline">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="w-60">
                <div className="flex w-full flex-initial flex-row items-center gap-5">
                  <img
                    className="pointer-events-none w-10 select-none invert-0 dark:invert"
                    src={RoomIcon}
                  />
                  <div className="grow" />
                  <p>入住至：58 月 76 日</p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="mb-2">
                <p>续住</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>续订房间</DrawerTitle>
            <DrawerDescription>您无需重新办理入住</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-row items-center p-4 pb-0">
            <p>续订至</p>
            <div className="grow" />
            <div className="">
              <DatePicker date={date} setDate={setdate} />
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
