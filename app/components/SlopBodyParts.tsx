type PartProps = {
  className?: string;
};

type LegSvgProps = PartProps & {
  variant: "left" | "right";
};

type ArmSvgProps = PartProps & {
  variant: "left" | "right";
};

function SlopPartShell({ className, children }: React.PropsWithChildren<PartProps>) {
  return (
    <svg
      viewBox="0 0 264.58333 264.58333"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {children}
    </svg>
  );
}

export function SlopHeadSvg({ className }: PartProps) {
  return (
    <SlopPartShell className={className}>
      <circle
        cx="132.3"
        cy="63.6"
        r="35.5"
        fill="var(--slop-body-fill)"
        stroke="var(--slop-body-stroke)"
        strokeWidth="7.5"
      />
      <path
        d="M108.7 78.8c7.3 7.9 39.7 8 47.1 0"
        fill="none"
        stroke="var(--slop-body-highlight)"
        strokeLinecap="round"
        strokeWidth="4.2"
        opacity="0.42"
      />
    </SlopPartShell>
  );
}

export function SlopBodySvg({ className }: PartProps) {
  return (
    <SlopPartShell className={className}>
      <path
        d="M91.3 88.4h82c6.1 0 11 4.9 11 11v77.4c0 6.6-5.4 12-12 12h-80c-6.6 0-12-5.4-12-12V99.4c0-6.1 4.9-11 11-11Z"
        fill="var(--slop-body-fill)"
        stroke="var(--slop-body-stroke)"
        strokeLinejoin="round"
        strokeWidth="7.5"
      />
      <path
        d="M94.8 95.8h74.8v83.6H94.8Z"
        fill="var(--slop-body-highlight)"
        opacity="0.28"
      />
    </SlopPartShell>
  );
}

export function SlopLegSvg({ className, variant }: LegSvgProps) {
  const x = variant === "left" ? 92.4 : 136.7;
  const skew = variant === "left" ? "rotate(3 109.8 212)" : "rotate(-3 154.1 212)";

  return (
    <SlopPartShell className={className}>
      <rect
        x={x}
        y="177.3"
        width="35"
        height="64.5"
        rx="5.2"
        transform={skew}
        fill="var(--slop-body-fill)"
        stroke="var(--slop-body-stroke)"
        strokeLinejoin="round"
        strokeWidth="7.5"
      />
      <path
        d={`M${x + 6} 185.2v47.2`}
        stroke="var(--slop-body-highlight)"
        strokeLinecap="round"
        strokeWidth="4"
        opacity="0.38"
      />
    </SlopPartShell>
  );
}

export function SlopArmSvg({ className, variant }: ArmSvgProps) {
  const x = variant === "left" ? 174.3 : 55.2;
  const rotate = variant === "left" ? "rotate(-5 190.3 148)" : "rotate(5 71.2 148)";

  return (
    <SlopPartShell className={className}>
      <rect
        x={x}
        y="98.6"
        width="34"
        height="98"
        rx="7"
        transform={rotate}
        fill="var(--slop-body-fill)"
        stroke="var(--slop-body-stroke)"
        strokeLinejoin="round"
        strokeWidth="7.5"
      />
      <path
        d={`M${x + 7} 110v72`}
        stroke="var(--slop-body-highlight)"
        strokeLinecap="round"
        strokeWidth="4"
        opacity="0.36"
      />
    </SlopPartShell>
  );
}
