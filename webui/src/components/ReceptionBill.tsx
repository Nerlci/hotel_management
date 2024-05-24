import { Button } from "@/components/ui/button";
import { useState } from "react";
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
import ReceptionBillingDetail from "./ReceptionBillingDetail";

export function RoomSelect({
  selectedRoom,
  setSelectedRoom,
  roomIds,
}: {
  selectedRoom: string;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string>>;
  roomIds: { value: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedRoom
            ? roomIds.find((roomId) => roomId.value === selectedRoom)?.value
            : "选择房间..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="房间号 ..." />
          <CommandEmpty>未找到房间号</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {roomIds.map((roomId) => (
                <CommandItem
                  key={roomId.value}
                  value={roomId.value}
                  onSelect={(currentValue) => {
                    setSelectedRoom(
                      currentValue === selectedRoom ? "" : currentValue,
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedRoom === roomId.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {roomId.value}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function ReceptionBill(props: { roomIds: { value: string }[] }) {
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedTab, setSelectedTab] = useState<"bill" | "detail">("detail");

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="flex w-full flex-row items-center gap-3">
          <div className="grow" />
          <div className="">
            <RoomSelect
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
              roomIds={props.roomIds}
            />
          </div>
          <div className="group flex h-9 rounded-sm bg-muted p-1">
            <Button
              variant="ghost"
              onClick={() => setSelectedTab("bill")}
              className={cn(
                selectedTab === "bill"
                  ? "bg-muted-foreground text-white dark:text-white"
                  : "",
                "h-7 w-20 rounded-sm hover:bg-foreground hover:text-white dark:hover:text-black",
              )}
            >
              生成账单
            </Button>
            <div className="flex w-1">
              <div className="grow" />
              <div className="my-auto h-4/6 w-[1px] rounded-full group-hover:bg-muted-foreground" />
              <div className="grow" />
            </div>
            <Button
              variant="ghost"
              onClick={() => setSelectedTab("detail")}
              className={cn(
                selectedTab === "detail"
                  ? "bg-muted-foreground text-white dark:text-white"
                  : "",
                "h-7 w-20 rounded-sm hover:bg-foreground hover:text-white dark:hover:text-black",
              )}
            >
              生成详单
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-3">
        {selectedTab === "bill" && (
          <div className="grow">
            <ReceptionOrderDetail roomId={selectedRoom} />
          </div>
        )}
        {selectedTab === "detail" && (
          <div className="grow">
            <ReceptionBillingDetail roomId={selectedRoom} />
          </div>
        )}
      </div>
    </div>
  );
}

export type DetailProps = {
  roomId: string;
};
