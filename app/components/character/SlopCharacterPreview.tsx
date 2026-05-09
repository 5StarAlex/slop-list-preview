"use client";

import Image from "next/image";
import { type CSSProperties, useMemo } from "react";
import { SlopArmSvg, SlopBodySvg, SlopHeadSvg, SlopLegSvg } from "../SlopBodyParts";
import { customizationOptions, type CharacterConfig } from "../slopOptions";

type SlopCharacterPreviewProps = {
  config: CharacterConfig;
  equippedShopItemIds?: string[];
  className?: string;
  pedestal?: boolean;
  backdrop?: boolean;
};

const basePose = {
  leg1: { x: -28, y: 10, rotate: 0, scale: 0.58 },
  leg2: { x: 28, y: 10, rotate: 0, scale: 0.58 },
  arm1: { x: -30, y: -66, rotate: -2, scale: 0.68 },
  body: { x: 0, y: -70, rotate: 0, scale: 0.64 },
  arm2: { x: 30, y: -66, rotate: 2, scale: 0.68 },
  head: { x: 0, y: -133, rotate: 0, scale: 0.56 },
  eyes: { x: 0, y: -133, rotate: 0, scale: 0.56 },
  mouth: { x: 0, y: -124, rotate: 0, scale: 0.56 },
} as const;

type PosePartKey = keyof typeof basePose;

function getPartStyle(partKey: PosePartKey): CSSProperties {
  const partBasePose = basePose[partKey];

  return {
    "--part-x": `${partBasePose.x}px`,
    "--part-y": `${partBasePose.y}px`,
    "--part-rotate": `${partBasePose.rotate}deg`,
    "--part-scale": `${partBasePose.scale}`,
  } as CSSProperties;
}

function getArmSwingStyle(side: "left" | "right"): CSSProperties {
  return {
    "--arm-rotate": side === "left" ? "-1.5deg" : "1.5deg",
  } as CSSProperties;
}

function getWearableClasses(config: CharacterConfig, equippedShopItemIds: string[]) {
  const classes = [];

  if (config.shirt > 0) {
    classes.push(`has-shirt-${customizationOptions.shirt[config.shirt]?.id ?? "basic"}`);
  }

  if (config.pants > 0) {
    classes.push(`has-pants-${customizationOptions.pants[config.pants]?.id ?? "basic"}`);
  }

  if (config.accessories > 0) {
    classes.push(`has-accessory-${customizationOptions.accessories[config.accessories]?.id ?? "basic"}`);
  }

  for (const itemId of equippedShopItemIds) {
    classes.push(`item-${itemId}`);
  }

  return classes.join(" ");
}

export default function SlopCharacterPreview({
  config,
  equippedShopItemIds = [],
  className = "",
  pedestal = true,
  backdrop = false,
}: SlopCharacterPreviewProps) {
  const selectedEyes = customizationOptions.eyes[config.eyes];
  const selectedMouth = customizationOptions.mouth[config.mouth];
  const selectedColor = customizationOptions.color[config.color];

  const characterThemeClass = useMemo(
    () => `slop-character-preview ${selectedColor.className} ${getWearableClasses(config, equippedShopItemIds)} ${className}`.trim(),
    [className, config, equippedShopItemIds, selectedColor.className],
  );

  const characterThemeStyle = useMemo(
    () =>
      ({
        "--slop-body-fill": selectedColor.fill,
        "--slop-body-stroke": selectedColor.stroke,
        "--slop-body-highlight": selectedColor.highlight,
      }) as CSSProperties,
    [selectedColor.fill, selectedColor.highlight, selectedColor.stroke],
  );

  return (
    <div className="slop-character-preview-shell">
      {backdrop ? <div className="slop-character-preview-backdrop" aria-hidden="true" /> : null}
      <div className={characterThemeClass} style={characterThemeStyle} aria-label="Current slop character preview">
        <div className="slop-creator-part slop-creator-part-leg1" style={getPartStyle("leg1")}>
          <SlopLegSvg variant="left" className="slop-creator-part-svg" />
        </div>
        <div className="slop-creator-part slop-creator-part-leg2" style={getPartStyle("leg2")}>
          <SlopLegSvg variant="right" className="slop-creator-part-svg" />
        </div>
        <div className="slop-creator-part slop-creator-part-arm1" style={getPartStyle("arm1")}>
          <div className="slop-creator-arm-swing slop-creator-arm-swing-left" style={getArmSwingStyle("left")}>
            <SlopArmSvg variant="right" className="slop-creator-part-svg" />
          </div>
        </div>
        <div className="slop-creator-part slop-creator-part-body" style={getPartStyle("body")}>
          <SlopBodySvg className="slop-creator-part-svg" />
          <span className="slop-character-shirt-overlay" aria-hidden="true" />
          <span className="slop-character-pants-overlay" aria-hidden="true" />
          <span className="slop-character-shoes-overlay" aria-hidden="true" />
        </div>
        <div className="slop-creator-part slop-creator-part-arm2" style={getPartStyle("arm2")}>
          <div className="slop-creator-arm-swing slop-creator-arm-swing-right" style={getArmSwingStyle("right")}>
            <SlopArmSvg variant="left" className="slop-creator-part-svg" />
          </div>
        </div>
        <div className="slop-creator-part slop-creator-part-head" style={getPartStyle("head")}>
          <SlopHeadSvg className="slop-creator-part-svg" />
          <span className="slop-character-accessory-overlay" aria-hidden="true" />
          <span className="slop-character-pet-orbit" aria-hidden="true" />
        </div>
        <div className="slop-creator-part slop-creator-part-eyes" style={getPartStyle("eyes")}>
          {selectedEyes.asset ? (
            <span className="slop-creator-face-layer">
              <Image src={selectedEyes.asset} alt="" fill unoptimized className="slop-creator-part-image" />
            </span>
          ) : null}
        </div>
        <div className="slop-creator-part slop-creator-part-mouth" style={getPartStyle("mouth")}>
          {selectedMouth.asset ? <Image src={selectedMouth.asset} alt="" fill unoptimized className="slop-creator-part-image" /> : null}
        </div>
      </div>
      {pedestal ? <div className="slop-character-preview-pedestal" aria-hidden="true" /> : null}
    </div>
  );
}
