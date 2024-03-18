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

export function RoomDrawer() {
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
          <div className="p-4 pb-0">TODO：续订房间页面</div>
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
