import { Button } from "@heroui/react";
import Image from "next/image";

interface VolumeSelectorProps {
  currentValue: number;
  onSelect: (value: number) => void;
}

export default function VolumeSelector({
  currentValue,
  onSelect,
}: VolumeSelectorProps) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-2">เลือกปริมาณด่วน</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          {
            label: "แก้วน้ำ",
            value: 250,
            icon: <i className="fa-solid fa-glass-water"></i>,
          },
          {
            label: "กระป๋อง",
            value: 330,
            icon: <Image src="/can.png" alt="can" width={20} height={20} />,
          },
          {
            label: "ขวดน้ำ",
            value: 600,
            icon: <i className="fa-solid fa-bottle-water"></i>,
          },
          {
            label: "แก้วเก็บความเย็น",
            value: 900,
            icon: (
              <Image src="/tumbler.png" alt="tumbler" width={20} height={20} />
            ),
          },
        ].map((preset) => (
          <Button
            key={preset.value}
            variant={currentValue === preset.value ? "solid" : "ghost"}
            color="primary"
            onPress={() => onSelect(preset.value)}
          >
            {preset.label}
            <span className="max-sm:hidden">{preset.icon}</span>
            <span className="max-sm:block">(≈ {preset.value} ml)</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
