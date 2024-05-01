import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ReceptionOrderDetail from "./ReceptionOrderDetail";
import { ScrollArea } from "@/components/ui/scroll-area";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export function RoomSelect() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function ReceptionCheckout() {
  const [showBill, setShowBill] = useState(false);

  return (
    <div className="h-[80vh]">
      <ResizablePanelGroup
        direction="vertical"
        className="w-full rounded-lg border"
      >
        <ResizablePanel defaultSize={25}>
          <div className="flex h-[200px] items-center justify-center p-6">
            <div className="relative mx-auto flex flex-row gap-3">
              <div className="">
                <RoomSelect />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowBill((prev) => !prev)}
              >
                生成账单 & 详单
              </Button>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <ResizablePanelGroup
            direction="horizontal"
            className="w-full rounded-lg border"
          >
            <ResizablePanel defaultSize={50}>
              <ScrollArea>
                <div className="bg-white">
                  {showBill && <ReceptionOrderDetail />}
                </div>
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>right</ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

// <ResizablePanelGroup direction="vertical">
//   <ResizablePanel defaultSize={25}>
//     <div className="flex h-full items-center justify-center p-6">
//       <span className="font-semibold">Two</span>
//     </div>
//   </ResizablePanel>
//   <ResizableHandle />
//   <ResizablePanel defaultSize={75}>
//     <div className="flex h-full items-center justify-center p-6">
//       <span className="font-semibold">Three</span>
//     </div>
//   </ResizablePanel>
// </ResizablePanelGroup>

// <div className="grow">
//   <Button variant="outline" onClick={() => setShowBill((prev) => !prev)}>
//     生成账单
//   </Button>
// </div>
// <div className="w-3/12">
//   {/*账单*/}
//   {showBill && (
//     <Card className="mx-auto mb-3 mt-3 w-full">
//       <ReceptionOrderDetail />
//     </Card>
//   )}
// </div>
