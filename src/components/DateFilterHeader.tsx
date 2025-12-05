"use client";

import type { RangeValue } from "@react-types/shared";
import type { DateValue } from "@react-types/datepicker";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  RangeCalendar,
  Button,
} from "@heroui/react";
import { getLocalTimeZone, now } from "@internationalized/date";
import { useState } from "react";

interface DateFilterHeaderProps {
  value: RangeValue<DateValue> | null;
  onChange: (value: RangeValue<DateValue> | null) => void;
  totalVolume: number;
}

export default function DateFilterHeader({
  value,
  onChange,
  totalVolume,
}: DateFilterHeaderProps) {
  const tz = getLocalTimeZone();
  const today = now(tz);
  const unavailableDates = (date: DateValue) => {
    return date > today;
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover placement="top" isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          variant="solid"
          color="primary"
          onPress={() => setIsOpen(true)}
          className={`mb-2 w-full h-auto py-2 ${
            value
              ? ""
              : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
          }`}
        >
          {value ? (
            <div className="flex flex-col items-center gap-1">
              <span className="hidden sm:block text-sm font-bold">
                {`${value.start.toDate(tz).toLocaleDateString("th-TH", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })} - ${value.end.toDate(tz).toLocaleDateString("th-TH", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}`}
              </span>
              <span className="hidden max-sm:block text-xs font-bold">
                {`${value.start
                  .toDate(tz)
                  .toLocaleDateString("th-TH")} - ${value.end
                  .toDate(tz)
                  .toLocaleDateString("th-TH")}`}
              </span>

              <span className="text-sm font-normal opacity-90 max-sm:text-xs">
                ปริมาณรวม: {totalVolume.toLocaleString()} ml
              </span>
            </div>
          ) : (
            "กรองวันที่ดื่ม"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-2">
          <RangeCalendar
            aria-label="Date range filter"
            value={value || undefined}
            onChange={onChange}
            visibleMonths={1}
            isDateUnavailable={unavailableDates}
          />
          {value && (
            <div className="flex justify-end mt-2 border-t pt-2">
              <Button
                className="text-xs"
                color="danger"
                variant="light"
                size="sm"
                onPress={() => {
                  onChange(null);
                  setIsOpen(false);
                }}
              >
                ล้างตัวกรอง
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
