type SlopTitleProps = {
  as?: "h1" | "h2" | "h3";
  children: string;
  className?: string;
  id?: string;
  size?: "lg" | "md" | "sm";
};

export default function SlopTitle({
  as: Tag = "h1",
  children,
  className = "",
  id,
  size = "lg",
}: SlopTitleProps) {
  return (
    <Tag id={id} className={`slop-composite-title slop-composite-title--${size} ${className}`.trim()}>
      <span className="slop-composite-title__outline" aria-hidden="true">
        {children}
      </span>
      <span className="slop-composite-title__fill">{children}</span>
    </Tag>
  );
}
