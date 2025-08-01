import React from "react";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface LabeledProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export const Labeled: React.FC<LabeledProps> = ({
  label,
  children,
  className,
}) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  );
};
