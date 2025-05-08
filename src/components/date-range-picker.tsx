"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, addDays, parseISO, isValid } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  initialStartDate?: string;
  initialEndDate?: string;
}

export function DateRangePicker({
  className,
  initialStartDate,
  initialEndDate,
}: DateRangePickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = React.useState(false);

  const today = new Date();
  const defaultEndDate = initialEndDate && isValid(parseISO(initialEndDate)) ? parseISO(initialEndDate) : today;
  const defaultStartDate = initialStartDate && isValid(parseISO(initialStartDate)) ? parseISO(initialStartDate) : addDays(defaultEndDate, -6);

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: defaultStartDate,
    to: defaultEndDate,
  });

  React.useEffect(() => {
    const spStartDate = searchParams.get("startDate");
    const spEndDate = searchParams.get("endDate");

    const currentFrom = spStartDate && isValid(parseISO(spStartDate)) ? parseISO(spStartDate) : defaultStartDate;
    const currentTo = spEndDate && isValid(parseISO(spEndDate)) ? parseISO(spEndDate) : defaultEndDate;
    
    if (date?.from?.toISOString().split('T')[0] !== currentFrom.toISOString().split('T')[0] || 
        date?.to?.toISOString().split('T')[0] !== currentTo.toISOString().split('T')[0]) {
      setDate({ from: currentFrom, to: currentTo });
    }
  // Only run on initial mount or when searchParams explicitly change, not 'date'
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, initialStartDate, initialEndDate]);


  const handleApply = () => {
    if (date?.from && date?.to) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set("startDate", format(date.from, "yyyy-MM-dd"));
      current.set("endDate", format(date.to, "yyyy-MM-dd"));
      const query = current.toString();
      router.push(`${window.location.pathname}?${query}`);
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full sm:w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className="p-3 border-t flex justify-end">
            <Button onClick={handleApply} size="sm">Apply</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
