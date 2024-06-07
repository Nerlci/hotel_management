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
import FoodIcon from "../assets/food.svg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import Img1 from "../assets/foods/sandwich.jpg";
import Img2 from "../assets/foods/salad.jpg";
import Img3 from "../assets/foods/noodle.jpg";
import Img4 from "../assets/foods/soup.jpg";
import Img5 from "../assets/foods/beverage.jpg";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { dataFetch } from "shared";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const images = [Img1, Img2, Img3, Img4, Img5];
const prices = [10, 15, 20, 20, 5];
const names = ["sandwich", "salad", "noodles", "soup", "beverage"];

export function FoodDrawer(props: { roomId: string }) {
  console.log(props.roomId);
  const billQuery = useQuery({
    queryKey: ["receptionBill"],
    queryFn: async () => await dataFetch.getBillDetail(props.roomId),
    enabled: !!props.roomId,
  });

  const [selected, setSelected] = useState(names.map(() => 0)); // 初始化每种食物的数量为0

  function calcPrice() {
    return selected.reduce((acc, count, idx) => acc + count * prices[idx], 0);
  }

  function updateQuantity(index: number, change: number) {
    setSelected((prev) => {
      const newSelected = [...prev];
      const newQuantity = newSelected[index] + change;
      newSelected[index] = newQuantity >= 0 ? newQuantity : 0;
      return newSelected;
    });
  }

  async function onSubmit() {
    const items = selected
      .map((quantity, index) => ({
        name: names[index],
        quantity,
      }))
      .filter((item) => item.quantity > 0);

    if (items.length === 0) {
      toast.error("未选中任何食物，请至少选择一项！");
      return;
    }

    try {
      const result = await dataFetch.postDining(items);
      console.log(result);
      setSelected(names.map(() => 0)); // 清空选择
      toast.success("订单提交成功!");
    } catch (error) {
      toast.error("订单提交失败！");
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="h-14 w-full lg:w-52" variant="outline">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex w-full flex-initial flex-row items-center gap-5">
                  <img
                    className="pointer-events-none w-10 select-none invert-0 dark:invert"
                    src={FoodIcon}
                  />
                  <div className="grow" />
                  <p>共消费：￥{billQuery.data?.statement.diningTotalFee}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="mb-2">
                <p>点餐</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle>点餐</DrawerTitle>
            <DrawerDescription>您的订单会产生额外计费</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full max-w-2xl"
            >
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center gap-2">
                          <img src={image} className="h-64 w-64 object-cover" />
                          <p>{names[index]}</p>
                          <div className="flex items-center gap-2">
                            <span>单价：{prices[index]}￥</span>
                            <span>数量：</span>
                            <button
                              onClick={() => updateQuantity(index, -1)}
                              disabled={selected[index] <= 0}
                            >
                              -
                            </button>
                            <span>{selected[index]}</span>
                            <button onClick={() => updateQuantity(index, 1)}>
                              +
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <DrawerFooter>
            <Button onClick={onSubmit}>提交：￥{calcPrice()}</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
