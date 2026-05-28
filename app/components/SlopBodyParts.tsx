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
        d="M97.6 92.8H167c5.5 0 10 4.5 10 10v63.1c0 6-4.8 10.8-10.8 10.8H98.4c-6 0-10.8-4.8-10.8-10.8v-63.1c0-5.5 4.5-10 10-10Z"
        fill="var(--slop-body-fill)"
        stroke="var(--slop-body-stroke)"
        strokeLinejoin="round"
        strokeWidth="7.5"
      />
      <path
        d="M101.2 100h62.1v67.8h-62.1Z"
        fill="var(--slop-body-highlight)"
        opacity="0.28"
      />
    </SlopPartShell>
  );
}

export function SlopLegSvg({ className, variant }: LegSvgProps) {
  const x = variant === "left" ? 92.8 : 136.8;
  const skew = variant === "left" ? "rotate(3 110.5 204)" : "rotate(-3 154.4 204)";

  return (
    <SlopPartShell className={className}>
      <rect
        x={x}
        y="156.8"
        width="35.8"
        height="86.2"
        rx="5.2"
        transform={skew}
        fill="var(--slop-body-fill)"
        stroke="var(--slop-body-stroke)"
        strokeLinejoin="round"
        strokeWidth="7.5"
      />
      <path
        d={`M${x + 6.4} 168.5v62.9`}
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
