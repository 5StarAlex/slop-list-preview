import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type NeonButtonProps = {
  children: ReactNode;
  variant?: "pink" | "purple" | "blue" | "gold";
  href?: string;
  className?: string;
  icon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function NeonButton({
  children,
  variant = "pink",
  href,
  className = "",
  icon,
  type = "button",
  ...props
}: NeonButtonProps) {
  const content = (
    <>
      {icon ? <span className="neon-button__icon">{icon}</span> : null}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`neon-button neon-button--${variant} ${className}`.trim()}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={`neon-button neon-button--${variant} ${className}`.trim()} {...props}>
      {content}
    </button>
  );
}
