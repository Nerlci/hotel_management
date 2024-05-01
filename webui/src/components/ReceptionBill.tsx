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

const roomIds = [
  {
    value: "8101",
  },
  {
    value: "8102",
  },
  {
    value: "8103",
  },
  {
    value: "8104",
  },
  {
    value: "8105",
  },
];

export function RoomSelect({
  selectedRoom,
  setSelectedRoom,
}: {
  selectedRoom: string;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string>>;
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

export default function ReceptionBill() {
  const [selectedRoom, setSelectedRoom] = useState("");

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="relative mx-auto flex flex-row gap-3">
          <div className="">
            <RoomSelect
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
            />
          </div>
          <Button variant="outline">生成账单 & 详单</Button>
        </div>
      </div>
      <div className="mt-3 flex gap-3">
        <div className="grow">
          <ReceptionOrderDetail roomId={selectedRoom} />
        </div>
        <div className="grow">
          <ReceptionBillingDetail roomId={selectedRoom} />
        </div>
      </div>
    </div>
  );
}

export type DetailProps = {
  roomId: string;
};
