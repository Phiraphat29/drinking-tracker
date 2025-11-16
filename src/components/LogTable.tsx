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
        className="overflow-x-auto bg-white/50 rounded-4xl"
        isStriped
      >
        <TableHeader>
          <TableColumn width={200} align="start" className="text-md">
            วันที่ดื่ม
          </TableColumn>
          <TableColumn width={200} align="start" className="text-md">
            ประเภทเครื่องดื่ม
          </TableColumn>
          <TableColumn width={200} align="start" className="text-md">
            ปริมาณเครื่องดื่ม (ml)
          </TableColumn>
          <TableColumn width={50} align="center" className="text-md">
            จัดการ
          </TableColumn>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                ไม่พบข้อมูล
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log?.id}>
                <TableCell>
                  {new Date(log?.created_at || "").toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>{log?.drink_name}</TableCell>
                <TableCell>{log?.amount_ml}</TableCell>
                <TableCell className="flex gap-2 justify-center">
                  <Button
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
                    color="danger"
                    variant="shadow"
                    onPress={() => {
                      setLogId(log?.id || 0);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    ลบ
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
