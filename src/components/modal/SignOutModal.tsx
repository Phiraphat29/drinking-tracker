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

interface SignOutModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SignOutModal({
  isOpen,
  onOpenChange,
}: SignOutModalProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();

    onOpenChange(false);
    router.refresh();
    addToast({
      title: "ออกจากระบบสำเร็จ",
      color: "success",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader>ยืนยันการออกจากระบบ</ModalHeader>
        <ModalBody>
          <p>ต้องการออกจากระบบใช่หรือไม่?</p>
          <p className="text-sm text-gray-500">กรุณายืนยันการออกจากระบบ</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={() => onOpenChange(false)}
          >
            ยกเลิก
          </Button>
          <Button color="danger" onPress={handleSignOut}>
            ออกจากระบบ
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
