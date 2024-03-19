import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { zhCN } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChineseDateFormat } from "shared";

export type DatePickerWithRangeProps = {
  className?: string;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
};

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {ChineseDateFormat(date.from)} - {ChineseDateFormat(date.to)}
                </>
              ) : (
                ChineseDateFormat(date.from)
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={zhCN}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
