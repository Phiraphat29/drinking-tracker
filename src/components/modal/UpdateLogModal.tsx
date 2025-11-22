"use client";

import {
  now,
  getLocalTimeZone,
  ZonedDateTime,
  parseAbsoluteToLocal,
} from "@internationalized/date";
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
import { Log } from "@/types/database";
import VolumeSelector from "../button/VolumeSelector";

interface UpdateLogModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  log: Log;
}

export default function UpdateLogModal({
  isOpen,
  onOpenChange,
  log,
}: UpdateLogModalProps) {
  const router = useRouter();
  const [drinkName, setDrinkName] = useState(log.drink_name);
  const [amountMl, setAmountMl] = useState(log.amount_ml.toString());
  //* date is the date of the log
  const [date, setDate] = useState<ZonedDateTime>(() =>
    parseAbsoluteToLocal(log.created_at)
  );

  const handleUpdateLog = async () => {
    if (
      !drinkName.trim() ||
      !amountMl.trim() ||
      parseInt(amountMl) <= 0 ||
      !date
    ) {
      addToast({
        title: "ป้อนข้อมูลให้ครบถ้วน",
        description: "ป้อนชื่อเครื่องดื่มและเครื่องดื่ม",
        color: "danger",
      });
      return;
    }
    const { error } = await supabase
      .from("drinking_log")
      .update({
        drink_name: drinkName,
        amount_ml: Number(amountMl),
        created_at: date?.toDate().toISOString(),
      })
      .eq("id", log.id);
    if (error) {
      addToast({
        title: "เปลี่ยนแปลงข้อมูลไม่สำเร็จ",
        description: "ตรวจสอบข้อมูลอีกครั้ง",
        color: "danger",
      });
    } else {
      onOpenChange(false);
      router.refresh();
      addToast({
        title: "เปลี่ยนแปลงข้อมูลสำเร็จ",
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
        <ModalHeader>แก้ไขการดื่มน้ำ</ModalHeader>
        <ModalBody>
          <I18nProvider locale="th-TH">
            <DatePicker
              label="วันที่ดื่ม"
              hideTimeZone
              showMonthAndYearPickers
              granularity="minute"
              hourCycle={24}
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
            onChange={(e) => setDrinkName(e.target.value)}
          />
          <VolumeSelector
            currentValue={parseInt(amountMl)}
            onSelect={(value) => setAmountMl(value.toString())}
          />
          <Input
            type="number"
            label="ปริมาณเครื่องดื่ม (ml)"
            variant="bordered"
            value={amountMl}
            min={0}
            onChange={(e) => setAmountMl(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button color="primary" onPress={handleUpdateLog}>
            บันทึกการแก้ไข
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
