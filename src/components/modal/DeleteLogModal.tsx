"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from "@heroui/react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface DeleteLogModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  id: number;
}

export default function DeleteLogModal({
  isOpen,
  onOpenChange,
  id,
}: DeleteLogModalProps) {
  const router = useRouter();

  const handleDeleteLog = async () => {

    if (!id || id === 0) {
      addToast({
        title: "ข้อมูลไม่ถูกต้อง",
        description: "ไม่พบข้อมูลที่ต้องการลบ",
        color: "danger",
      });
      return;
    }
    
    console.log("Executing delete query...");
    const { error } = await supabase
      .from("drinking_log")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error occurred while deleting log:", error);      
      addToast({
        title: "ลบข้อมูลไม่สำเร็จ",
        description: "กรุณาลองใหม่อีกครั้ง",
        color: "danger",
      });
    } else {
      console.log("Log deleted successfully.");      
      onOpenChange(false);
      router.refresh();
      addToast({
        title: "ลบข้อมูลสำเร็จ",
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
        <ModalHeader>ยืนยันการลบข้อมูล</ModalHeader>
        <ModalBody>
          <p>
            คุณต้องการลบบันทึกการดื่มนี้ใช่หรือไม่?
          </p>
          <p className="text-sm text-gray-500">
            การดำเนินการนี้ไม่สามารถย้อนกลับได้
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button color="danger" onPress={handleDeleteLog}>
            ลบ
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
