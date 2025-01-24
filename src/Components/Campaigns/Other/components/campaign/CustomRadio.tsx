import { Radio } from "@heroui/react";
import { cn } from "@heroui/react";

interface CustomRadioProps {
  children: React.ReactNode;
  description: string;
  value: string;
}

export function CustomRadio({ children, ...props }: CustomRadioProps) {
  return (
    <Radio
      {...props}
      classNames={{
        base: cn(
          "inline-flex m-0 items-center justify-between flex-row-reverse max-w-[300px] cursor-pointer",
          "rounded-lg gap-4 p-4 border-2",
          "data-[selected=true]:border-primary"
        ),
      }}
    >
      {children}
    </Radio>
  );
}

