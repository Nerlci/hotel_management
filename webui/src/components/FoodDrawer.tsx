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
import FoodIcon from "../assets/food.svg";

export function FoodDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="h-14 w-20" variant="outline">
          <img
            className="w-10 invert-0 dark:invert select-none pointer-events-none"
            src={FoodIcon}
          />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>点餐</DrawerTitle>
            <DrawerDescription>您的订单会产生额外计费</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">TODO：选择菜品页面</div>
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
