import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const TempSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-10 w-full grow overflow-hidden rounded-xl bg-gradient-to-r from-blue-300 to-orange-300 disabled:opacity-50">
      <SliderPrimitive.Range className="absolute h-full bg-primary/0" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block h-10 w-3 rounded-2xl border-0 border-primary bg-white/90 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      asChild
    >
      <div className="flex flex-col">
        <div className="grow" />
        <div className="mx-auto block h-5 w-0.5 rounded-full bg-black" />
        <div className="grow" />
      </div>
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));
TempSlider.displayName = SliderPrimitive.Root.displayName;

export { TempSlider };
