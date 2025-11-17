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

export default function LogTable({ logs }: { logs: (Log | null)[] }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [logId, setLogId] = useState<number>(0);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [log, setLog] = useState<Log | null>(null);

  return (
    <>
      <DeleteLogModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        id={logId}
      />
      {isUpdateModalOpen && log && (
        <UpdateLogModal
          isOpen={isUpdateModalOpen}
          onOpenChange={setIsUpdateModalOpen}
          log={log}
        />
      )}

      <Table
        aria-label="Drinking log table"
        className="rounded-3xl text-xs sm:text-sm"
        isVirtualized
        maxTableHeight={500}
      >
        <TableHeader>
          <TableColumn align="start">วันที่ดื่ม</TableColumn>
          <TableColumn align="start">ประเภทเครื่องดื่ม</TableColumn>
          <TableColumn align="end">ปริมาณ (ml)</TableColumn>
          <TableColumn align="center">จัดการ</TableColumn>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
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

                <TableCell className="text-right">{log?.amount_ml}</TableCell>

                <TableCell className="flex justify-center gap-2">
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
