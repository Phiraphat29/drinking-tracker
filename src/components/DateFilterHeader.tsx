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
}

export default function DateFilterHeader({
  value,
  onChange,
}: DateFilterHeaderProps) {
  const tz = getLocalTimeZone();
  const today = now(tz);
  const unavailableDates = (date: DateValue) => {
    return date > today;
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover placement="bottom-end" isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger onPress={() => setIsOpen(true)}>
        <div
          className={`
          flex items-center gap-2 cursor-pointer transition-colors duration-300 select-none
          ${
            value
              ? "text-blue-600 font-bold"
              : "hover:text-gray-900 dark:hover:text-gray-600 "
          }
        `}
        >
          <span className="hidden sm:block">
            {/* dd-mm-yyyy - dd-mm-yyyy format full thai month name */}
            {value
              ? `${value.start.toDate(tz).toLocaleDateString("th-TH", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })} - ${value.end.toDate(tz).toLocaleDateString("th-TH", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}`
              : "วันที่ดื่ม"}
          </span>
          <span className="hidden max-sm:block">
            {value
              ? `${value.start
                  .toDate(tz)
                  .toLocaleDateString("th-TH")} - ${value.end
                  .toDate(tz)
                  .toLocaleDateString("th-TH")}`
              : "วันที่ดื่ม"}
          </span>
          <i className="fa-solid fa-filter"></i>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-2">
          <RangeCalendar
            aria-label="Date range filter"
            value={value || undefined}
            onChange={onChange}
            visibleMonths={window.innerWidth < 640 ? 1 : 2}
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
