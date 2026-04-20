"use client";

import starBackground from "../NewStyleIcons/Stary Background.jpg";
import starOverlay from "../NewStyleIcons/StaryOverlay.png";

type SpaceParallaxLayersProps = {
  offset: { x: number; y: number };
  className?: string;
  includeNebula?: boolean;
  includeScanlines?: boolean;
  intensity?: "low" | "medium" | "high";
};

const intensityMap = {
  low: {
    backX: -6,
    backY: -4,
    midX: -12,
    midY: -8,
    frontX: -18,
    frontY: -12,
    nebulaX: -10,
    nebulaY: -7,
  },
  medium: {
    backX: -8,
    backY: -6,
    midX: -18,
    midY: -12,
    frontX: -28,
    frontY: -18,
    nebulaX: -14,
    nebulaY: -10,
  },
  high: {
    backX: -10,
    backY: -7,
    midX: -22,
    midY: -15,
    frontX: -34,
    frontY: -22,
    nebulaX: -18,
    nebulaY: -12,
  },
} as const;

function translate(offset: { x: number; y: number }, xStrength: number, yStrength: number) {
  return `translate(${offset.x * xStrength}px, ${offset.y * yStrength}px)`;
}

export default function SpaceParallaxLayers({
  offset,
  className = "",
  includeNebula = true,
  includeScanlines = false,
  intensity = "medium",
}: SpaceParallaxLayersProps) {
  const motion = intensityMap[intensity];

  return (
    <div className={`space-parallax-layers ${className}`.trim()} aria-hidden="true">
      <div
        className="star-layer star-layer-back"
        style={{
          transform: translate(offset, motion.backX, motion.backY),
          backgroundImage: `url("${starBackground.src}")`,
        }}
      />
      <div
        className="star-layer star-layer-mid"
        style={{
          transform: translate(offset, motion.midX, motion.midY),
          backgroundImage: `url("${starOverlay.src}")`,
        }}
      />
      <div
        className="star-layer star-layer-front"
        style={{
          transform: translate(offset, motion.frontX, motion.frontY),
        }}
      />
      {includeNebula ? (
        <div
          className="space-nebula-layer"
          style={{
            transform: translate(offset, motion.nebulaX, motion.nebulaY),
          }}
        />
      ) : null}
      {includeScanlines ? <div className="space-scanline-layer" /> : null}
      <div className="space-gloss-layer" />
    </div>
  );
}
