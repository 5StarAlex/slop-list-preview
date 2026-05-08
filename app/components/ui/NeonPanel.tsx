import { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";

type NeonPanelProps<T extends ElementType> = {
  as?: T;
  variant?: "pink" | "purple" | "blue" | "gold" | "dark";
  className?: string;
  children: ReactNode;
};

export default function NeonPanel<T extends ElementType = "section">({
  as,
  variant = "purple",
  className = "",
  children,
  ...props
}: NeonPanelProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof NeonPanelProps<T>>) {
  const Tag = as ?? "section";

  return (
    <Tag className={`neon-panel neon-panel--${variant} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
