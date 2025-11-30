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
import { useRouter } from "next/navigation";
import { signOutAction } from "@/app/auth/actions";

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
    try {
      addToast({
        title: "ออกจากระบบสำเร็จ",
        color: "success",
      });
      await signOutAction();

      onOpenChange(false);
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/sign-in");
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
