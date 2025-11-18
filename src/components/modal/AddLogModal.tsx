"use client";

import { now, getLocalTimeZone, ZonedDateTime } from "@internationalized/date";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  DatePicker,
  addToast,
} from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface AddLogModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export default function AddLogModal({
  isOpen,
  onOpenChange,
  userId,
}: AddLogModalProps) {
  const [drinkName, setDrinkName] = useState("");
  const [amountMl, setAmountMl] = useState("");
  const router = useRouter();
  const [date, setDate] = useState<ZonedDateTime>(now(getLocalTimeZone()));

  //* handle Upload log
  const handleUploadLog = async () => {
    if (!drinkName.trim() || !amountMl.trim() || parseInt(amountMl) <= 0) {
      addToast({
        title: "กรุณาป้อนข้อมูลให้ครบถ้วน",
        description: "กรุณาป้อนชื่อเครื่องดื่มและปริมาณเครื่องดื่ม",
        color: "danger",
      });
      return;
    }

    const { error } = await supabase.from("drinking_log").insert({
      user_id: userId,
      drink_name: drinkName,
      amount_ml: amountMl,
      created_at: date.toDate().toISOString(),
    });

    if (error) {
      console.error(error);
      addToast({
        title: "บันทึกข้อมูลไม่สำเร็จ",
        description: "กรุณาตรวจสอบข้อมูลอีกครั้ง",
        color: "danger",
      });
    } else {
      onOpenChange(false);
      setDate(now(getLocalTimeZone()));
      setDrinkName("");
      setAmountMl("");
      router.refresh();
      addToast({
        title: "บันทึกข้อมูลสำเร็จ",
        color: "success",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader>เพิ่มบันทึกการดื่มน้ำ</ModalHeader>
        <ModalBody>
          <I18nProvider locale="th-TH">
            <DatePicker
              label="วันที่ดื่ม"
              hideTimeZone
              showMonthAndYearPickers
              granularity="minute"
              hourCycle={24}
              defaultValue={now(getLocalTimeZone())}
              maxValue={now(getLocalTimeZone())}
              variant="bordered"
              onChange={(date) => setDate(date as ZonedDateTime)}
              value={date}
            />
          </I18nProvider>
          <Input
            type="text"
            label="ชื่อเครื่องดื่ม"
            variant="bordered"
            value={drinkName}
            isRequired
            onChange={(e) => setDrinkName(e.target.value)}
          />
          <Input
            type="number"
            label="ปริมาณเครื่องดื่ม (ml)"
            variant="bordered"
            value={amountMl}
            isRequired
            min={0}
            onChange={(e) => setAmountMl(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button color="primary" onPress={handleUploadLog}>
            เพิ่ม
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
