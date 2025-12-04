"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
} from "@heroui/react";
import { Log } from "@/types/database";
import DeleteLogModal from "@/components/modal/DeleteLogModal";
import UpdateLogModal from "@/components/modal/UpdateLogModal";
import { useState } from "react";
import type { RangeValue } from "@react-types/shared";
import type { DateValue } from "@react-types/datepicker";
import DateFilterHeader from "./DateFilterHeader";

interface LogTableProps {
  logs: (Log | null)[];
  dateRange: RangeValue<DateValue> | null;
  onDateRangeChange: (value: RangeValue<DateValue> | null) => void;
}

export default function LogTable({
  logs,
  dateRange,
  onDateRangeChange,
}: LogTableProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [logId, setLogId] = useState<number>(0);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [log, setLog] = useState<Log | null>(null);

  const totalVolume = logs.reduce((acc, log) => acc + (log?.amount_ml || 0), 0);

  return (
    <>
      <DeleteLogModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        id={logId}
      />
      {log && (
        <UpdateLogModal
          isOpen={isUpdateModalOpen}
          onOpenChange={setIsUpdateModalOpen}
          log={log}
        />
      )}

      {/* display total volume if user choose date range*/}
      {dateRange && (
        <div className="flex justify-end items-center gap-2 mb-2 px-2 z-10 animate-appearance-in">
          <span className="text-sm">ยอดรวมในช่วงที่เลือก:</span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-300">
            {totalVolume.toLocaleString()} ml
          </span>
        </div>
      )}

      <Table
        aria-label="Drinking log table"
        className="rounded-3xl text-xs sm:text-sm"
        isVirtualized
        isHeaderSticky
        maxTableHeight={500}
      >
        <TableHeader>
          <TableColumn align="start">
            <DateFilterHeader value={dateRange} onChange={onDateRangeChange} />
          </TableColumn>
          <TableColumn align="start">ชื่อเครื่องดื่ม</TableColumn>
          <TableColumn align="end">ปริมาณ (ml)</TableColumn>
          <TableColumn align="center">จัดการ</TableColumn>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-45">
                ไม่พบข้อมูล
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log?.id}>
                <TableCell>
                  <span className="hidden sm:inline">
                    {new Date(log?.created_at || "").toLocaleDateString(
                      "th-TH",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                  {/* date for mobile */}
                  <span className="sm:hidden">
                    {new Date(log?.created_at || "").toLocaleDateString(
                      "th-TH",
                      {
                        year: "2-digit",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </TableCell>

                <TableCell className="truncate max-w-40 sm:max-w-none">
                  {log?.drink_name}
                </TableCell>

                <TableCell className="text-center">{log?.amount_ml}</TableCell>

                <TableCell className="flex justify-center gap-3">
                  <Button
                    className="max-sm:hidden"
                    color="primary"
                    variant="shadow"
                    onPress={() => {
                      setLog(log);
                      setIsUpdateModalOpen(true);
                    }}
                  >
                    แก้ไข
                  </Button>
                  <Button
                    className="max-sm:hidden"
                    color="danger"
                    variant="ghost"
                    onPress={() => {
                      setLogId(log?.id || 0);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    ลบ
                  </Button>

                  {/* icon-only for mobile */}
                  <Button
                    className="sm:hidden"
                    isIconOnly
                    color="primary"
                    onPress={() => {
                      setLog(log);
                      setIsUpdateModalOpen(true);
                    }}
                  >
                    <i className="fa-solid fa-pen" />
                  </Button>
                  <Button
                    className="sm:hidden"
                    isIconOnly
                    color="danger"
                    variant="flat"
                    onPress={() => {
                      setLogId(log?.id || 0);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <i className="fa-solid fa-trash" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
