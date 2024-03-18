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
import RoomIcon from "../assets/bed.svg";
import { useEffect, useState } from "react";
import { DatePicker } from "./DatePicker";

export function RoomDrawer() {
  const [date, setdate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    // TODO: post to server
  }, [date]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="h-14 w-20" variant="outline">
          <img
            className="w-10 invert-0 dark:invert select-none pointer-events-none"
            src={RoomIcon}
          />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>续订房间</DrawerTitle>
            <DrawerDescription>您无需重新办理入住</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 flex flex-row items-center">
            <p>续订至</p>
            <div className="grow" />
            <div className="">
              <DatePicker date={date} setDate={setdate} />
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
