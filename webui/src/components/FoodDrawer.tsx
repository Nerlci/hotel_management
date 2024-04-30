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
import { Checkbox } from "./ui/checkbox";
import Img1 from "../assets/foods/casey-lee-awj7sRviVXo-unsplash.jpg";
import Img2 from "../assets/foods/anh-nguyen-kcA-c3f_3FE-unsplash.jpg";
import Img3 from "../assets/foods/eiliv-aceron-ZuIDLSz3XLg-unsplash.jpg";
import Img4 from "../assets/foods/joseph-gonzalez-fdlZBWIP0aM-unsplash.jpg";
import Img5 from "../assets/foods/anna-tukhfatullina-food-photographer-stylist-Mzy-OjtCI70-unsplash.jpg";
import { useState } from "react";

const images = [Img1, Img2, Img3, Img4, Img5];
const prices = [10, 20, 30, 40, 50];
const selectedInit = [false, false, false, false, false];

export function FoodDrawer() {
  const [selected, setselected] = useState(selectedInit);

  function calcPrice(selected: boolean[]) {
    let res = 0;
    for (let i = 0; i < selected.length; i++) {
      if (selected[i]) {
        res += prices[i];
      }
    }
    return res;
  }

  function onSubmit() {
    // TODO: post to server
    console.log("Selected: ", selected);
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className=" h-14 w-20" variant="outline">
          <img
            className="pointer-events-none w-10 select-none invert-0 dark:invert"
            src={FoodIcon}
          />
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
              <CarouselContent className="">
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="xs:basis-auto sm:basis-auto md:basis-auto lg:basis-auto"
                  >
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square flex-col items-center justify-center gap-2 p-3">
                          <img
                            className="h-64 w-64 object-cover"
                            src={images[index]}
                          />
                          <div className="flex flex-row items-center gap-2">
                            <Checkbox
                              onClick={() => {
                                setselected((prev) => {
                                  prev[index] = !prev[index];
                                  return [...prev];
                                });
                              }}
                            />
                            <div>{prices[index]}￥</div>
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
            <Button onClick={onSubmit}>提交：￥{calcPrice(selected)}</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
