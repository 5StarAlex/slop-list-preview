"use client";

import Image from "next/image";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import {
  creatorCategories,
  customizationOptions,
  defaultCharacterConfig,
  expressionPresets,
  type CharacterConfig,
  type ConfigurableCategoryKey,
  type CreatorCategoryKey,
} from "./slopOptions";
import { SlopArmSvg, SlopBodySvg, SlopHeadSvg, SlopLegSvg } from "./SlopBodyParts";

const statRows = [
  { label: "Speed", values: { eyes: 88, mouth: 74, pose: 82, shirt: 62, pants: 68, accessories: 80, color: 56 } },
  { label: "Dash", values: { eyes: 42, mouth: 58, pose: 90, shirt: 84, pants: 70, accessories: 64, color: 52 } },
  { label: "Accent", values: { eyes: 66, mouth: 78, pose: 72, shirt: 55, pants: 90, accessories: 74, color: 95 } },
  { label: "Skill", values: { eyes: 52, mouth: 68, pose: 86, shirt: 72, pants: 86, accessories: 79, color: 60 } },
] as const;

const dockItems = [
  { key: "home", label: "Home" },
  { key: "character", label: "Character", isActive: true },
  { key: "store", label: "Store" },
] as const;

const swatchClassMap = {
  eyes: "slop-creator-option-swatch-eyes",
  mouth: "slop-creator-option-swatch-mouth",
  pose: "slop-creator-option-swatch-pose",
  shirt: "slop-creator-option-swatch-shirt",
  pants: "slop-creator-option-swatch-pants",
  accessories: "slop-creator-option-swatch-accessories",
  color: "slop-creator-option-swatch-color",
} as const;

const IDLE_AMPLITUDE = 4;
const IDLE_FREQUENCY = 0.0019;
const ARM_SWING_DEGREES = 2;

const basePose = {
  leg1: { x: -24, y: 0 },
  leg2: { x: 24, y: 0 },
  arm1: { x: -55, y: -76 },
  body: { x: 0, y: -80 },
  shirt: { x: 0, y: -76 },
  pants: { x: 0, y: -76 },
  arm2: { x: 55, y: -76 },
  head: { x: 0, y: -167 },
  eyes: { x: 0, y: -164 },
  mouth: { x: 0, y: -142 },
  accessory: { x: 0, y: -164 },
} as const;

const idleWeights = {
  leg1: 0,
  leg2: 0,
  arm1: 0.9,
  body: 1,
  shirt: 1,
  pants: 0.85,
  arm2: 0.9,
  head: 1.2,
  eyes: 1.15,
  mouth: 1.1,
  accessory: 1.18,
} as const;

type PosePartKey = keyof typeof basePose;

function isConfigurableCategoryKey(categoryKey: CreatorCategoryKey): categoryKey is ConfigurableCategoryKey {
  return categoryKey !== "stats";
}

function getCategoryCount(categoryKey: CreatorCategoryKey, characterConfig: CharacterConfig) {
  if (!isConfigurableCategoryKey(categoryKey)) {
    return "Layer Type";
  }

  return `${characterConfig[categoryKey] + 1} / ${customizationOptions[categoryKey].length}`;
}

function getOptionSubLabel(categoryKey: ConfigurableCategoryKey) {
  if (categoryKey === "color") {
    return "Theme Layer";
  }

  if (categoryKey === "pose") {
    return "Rig Profile";
  }

  return "Preview Layer";
}

export default function CreateASlop() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [characterConfig, setCharacterConfig] = useState<CharacterConfig>(defaultCharacterConfig);
  const [idleOffset, setIdleOffset] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  const activeCategoryKey = creatorCategories[activeIndex].key;
  const isStatsView = activeCategoryKey === "stats";
  const activeOptionCategoryKey = isConfigurableCategoryKey(activeCategoryKey) ? activeCategoryKey : "pose";
  const activeOptions = customizationOptions[activeOptionCategoryKey];
  const activeOptionIndex = characterConfig[activeOptionCategoryKey];
  const activeOption = activeOptions[activeOptionIndex];
  const showExpressionPresets = activeOptionCategoryKey === "eyes" || activeOptionCategoryKey === "mouth";
  const statProfileKey = isStatsView ? "pose" : activeOptionCategoryKey;

  const selectedEyes = customizationOptions.eyes[characterConfig.eyes];
  const selectedMouth = customizationOptions.mouth[characterConfig.mouth];
  const selectedPose = customizationOptions.pose[characterConfig.pose];
  const selectedShirt = customizationOptions.shirt[characterConfig.shirt];
  const selectedPants = customizationOptions.pants[characterConfig.pants];
  const selectedAccessory = customizationOptions.accessories[characterConfig.accessories];
  const selectedColor = customizationOptions.color[characterConfig.color];

  const characterThemeClass = useMemo(() => `slop-creator-character ${selectedColor.className}`, [selectedColor.className]);
  const characterThemeStyle = useMemo(
    () =>
      ({
        "--slop-body-fill": selectedColor.fill,
        "--slop-body-stroke": selectedColor.stroke,
        "--slop-body-highlight": selectedColor.highlight,
      }) as CSSProperties,
    [selectedColor.fill, selectedColor.highlight, selectedColor.stroke],
  );

  useEffect(() => {
    let frameId = 0;
    const startTime = performance.now();

    const animate = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      setIdleOffset(Math.sin(elapsed * IDLE_FREQUENCY) * IDLE_AMPLITUDE);
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    let blinkTimeoutId = 0;
    let blinkResetId = 0;

    const scheduleBlink = () => {
      const nextBlinkDelay = 4200 + Math.random() * 3200;

      blinkTimeoutId = window.setTimeout(() => {
        setIsBlinking(true);

        blinkResetId = window.setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 110);
      }, nextBlinkDelay);
    };

    scheduleBlink();

    return () => {
      window.clearTimeout(blinkTimeoutId);
      window.clearTimeout(blinkResetId);
    };
  }, []);

  function getIdlePartStyle(partKey: PosePartKey): CSSProperties {
    const partBasePose = basePose[partKey];
    const weightedOffset = idleOffset * idleWeights[partKey];

    return {
      "--part-x": `${partBasePose.x}px`,
      "--part-y": `${partBasePose.y + weightedOffset}px`,
    } as CSSProperties;
  }

  function getArmSwingStyle(side: "left" | "right"): CSSProperties {
    const downwardProgress = Math.max(0, idleOffset / IDLE_AMPLITUDE);
    const armRotation = side === "left" ? ARM_SWING_DEGREES * downwardProgress : -ARM_SWING_DEGREES * downwardProgress;

    return {
      "--arm-rotate": `${armRotation}deg`,
    } as CSSProperties;
  }

  function cycleOption(categoryKey: ConfigurableCategoryKey, direction: 1 | -1) {
    const options = customizationOptions[categoryKey];
    const currentIndex = characterConfig[categoryKey];
    const nextIndex = (currentIndex + direction + options.length) % options.length;

    setCharacterConfig((prev) => ({
      ...prev,
      [categoryKey]: nextIndex,
    }));
  }

  function applyExpression(name: keyof typeof expressionPresets) {
    const preset = expressionPresets[name];

    setCharacterConfig((prev) => ({
      ...prev,
      eyes: preset.eyes,
      mouth: preset.mouth,
    }));
  }

  return (
    <section className="slop-creator-shell" aria-labelledby="create-a-slop-heading">
      <div className="slop-creator-left">
        <div className="slop-creator-brand-block">
          <div className="slop-creator-brand-mark" id="create-a-slop-heading">
            SLOP.IO
          </div>

          <section className="slop-creator-hud" aria-label="Creator HUD">
            <div className="slop-creator-hud-currency-row">
              <div className="slop-creator-hud-currency">
                <span className="slop-creator-hud-currency-icon slop-creator-hud-currency-icon-coin" aria-hidden="true" />
                <span>666531</span>
              </div>
              <div className="slop-creator-hud-currency">
                <span className="slop-creator-hud-currency-icon slop-creator-hud-currency-icon-gem" aria-hidden="true" />
                <span>652</span>
              </div>
            </div>

            <div className="slop-creator-hud-power-card">
              <div className="slop-creator-hud-power-head">
                <span className="slop-creator-hud-power-kicker">Level</span>
                <span className="slop-creator-hud-power-meta">{selectedPose.label}</span>
              </div>
              <div className="slop-creator-hud-power-meter" aria-hidden="true">
                <span className="slop-creator-hud-power-fill" />
                <span className="slop-creator-hud-power-gloss" />
              </div>
            </div>
          </section>
        </div>

        {isStatsView ? (
          <section className="slop-creator-stats" aria-label="Current category stats">
            <div className="slop-creator-stats-title">Layer Type</div>
            <div className="slop-creator-stats-grid">
              {statRows.map((row) => (
                <div key={row.label} className="slop-creator-stat-row">
                  <span className="slop-creator-stat-label">{row.label}</span>
                  <div className="slop-creator-stat-meter">
                    <span
                      className="slop-creator-stat-fill"
                      style={{ width: `${row.values[statProfileKey]}%` }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="slop-creator-option-panel" aria-label={`Editing ${creatorCategories[activeIndex].label}`}>
            <div className="slop-creator-option-header">
              <span className="slop-creator-option-kicker">{creatorCategories[activeIndex].label}</span>
              <span className="slop-creator-option-count">
                {activeOptionIndex + 1} / {activeOptions.length}
              </span>
            </div>

            <div className="slop-creator-option-picker">
              <button
                type="button"
                className="slop-creator-cycle-button"
                onClick={() => cycleOption(activeOptionCategoryKey, -1)}
                aria-label={`Previous ${creatorCategories[activeIndex].label} option`}
              >
                &lt;
              </button>

              <div className="slop-creator-option-window">
                <div className="slop-creator-option-swatch">
                  <span
                    className={`slop-creator-option-swatch-shape ${swatchClassMap[activeOption.swatchType]} ${
                      activeOption.swatchType === "color" ? selectedColor.className : ""
                    }`}
                    aria-hidden="true"
                  />
                </div>

                <div className="slop-creator-option-copy">
                  <div className="slop-creator-option-name">{activeOption.label}</div>
                  <div className="slop-creator-option-sub">{getOptionSubLabel(activeOptionCategoryKey)}</div>
                </div>
              </div>

              <button
                type="button"
                className="slop-creator-cycle-button"
                onClick={() => cycleOption(activeOptionCategoryKey, 1)}
                aria-label={`Next ${creatorCategories[activeIndex].label} option`}
              >
                &gt;
              </button>
            </div>

            {showExpressionPresets ? (
              <div className="slop-creator-expression-row" aria-label="Expression presets">
                <button type="button" className="slop-creator-expression-pill" onClick={() => applyExpression("angry")}>
                  Angry
                </button>
                <button type="button" className="slop-creator-expression-pill" onClick={() => applyExpression("sad")}>
                  Sad
                </button>
                <button type="button" className="slop-creator-expression-pill" onClick={() => applyExpression("whistle")}>
                  Whistle
                </button>
              </div>
            ) : null}
          </section>
        )}

        <div className="slop-creator-progress-dots" aria-hidden="true">
          <span className={`slop-creator-progress-dot${activeIndex === 0 ? " is-active" : ""}`} />
          <span className={`slop-creator-progress-dot${activeIndex > 0 && activeIndex < creatorCategories.length - 1 ? " is-active" : ""}`} />
          <span className={`slop-creator-progress-dot${activeIndex === creatorCategories.length - 1 ? " is-active" : ""}`} />
        </div>

        <div className="slop-creator-category-grid" aria-label="Customization categories">
          {creatorCategories.map((category, index) => {
            return (
              <button
                key={category.key}
                type="button"
                className={`slop-creator-category-tile${index === activeIndex ? " is-active" : ""}`}
                onClick={() => setActiveIndex(index)}
                aria-pressed={index === activeIndex}
              >
                <span className="slop-creator-category-tile-label">{category.label}</span>
                <span className="slop-creator-category-tile-count">{getCategoryCount(category.key, characterConfig)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="slop-creator-stage-shell">
        <div className="slop-creator-stage">
          <div className="slop-creator-stage-orb slop-creator-stage-orb-blue" aria-hidden="true" />
          <div className="slop-creator-stage-orb slop-creator-stage-orb-violet" aria-hidden="true" />
          <div className="slop-creator-stage-orb slop-creator-stage-orb-cyan" aria-hidden="true" />
          <div className="slop-creator-stage-triangle slop-creator-stage-triangle-one" aria-hidden="true" />
          <div className="slop-creator-stage-triangle slop-creator-stage-triangle-two" aria-hidden="true" />
          <div className="slop-creator-stage-triangle slop-creator-stage-triangle-three" aria-hidden="true" />
          <div className="slop-creator-stage-triangle slop-creator-stage-triangle-four" aria-hidden="true" />
          <div className="slop-creator-stage-triangle slop-creator-stage-triangle-five" aria-hidden="true" />
          <div className="slop-creator-stage-triangle slop-creator-stage-triangle-six" aria-hidden="true" />
          <div className="slop-creator-stage-triangle slop-creator-stage-triangle-seven" aria-hidden="true" />
          <div className="slop-creator-stage-triangle slop-creator-stage-triangle-eight" aria-hidden="true" />
          <div className="slop-creator-stage-triangle slop-creator-stage-triangle-nine" aria-hidden="true" />
          <div className="slop-creator-stage-triangle slop-creator-stage-triangle-ten" aria-hidden="true" />
          <div className="slop-creator-stage-triangle slop-creator-stage-triangle-eleven" aria-hidden="true" />
          <div className="slop-creator-stage-triangle slop-creator-stage-triangle-twelve" aria-hidden="true" />
          <div className="slop-creator-stage-triangle slop-creator-stage-triangle-thirteen" aria-hidden="true" />
          <div className="slop-creator-stage-triangle slop-creator-stage-triangle-fourteen" aria-hidden="true" />
          <div className="slop-creator-stage-grid" aria-hidden="true" />
          <div className="slop-creator-stage-floor" aria-hidden="true" />

          <div className="slop-creator-stage-tools" aria-hidden="true">
            <span className="slop-creator-stage-tool" />
            <span className="slop-creator-stage-tool" />
            <span className="slop-creator-stage-tool" />
            <span className="slop-creator-stage-tool" />
          </div>

          <div
            className={characterThemeClass}
            style={characterThemeStyle}
            aria-label="Character preview built from uploaded SVG parts"
          >
            <div className="slop-creator-part slop-creator-part-leg1" style={getIdlePartStyle("leg1")}>
              <SlopLegSvg variant="left" className="slop-creator-part-svg" />
            </div>
            <div className="slop-creator-part slop-creator-part-leg2" style={getIdlePartStyle("leg2")}>
              <SlopLegSvg variant="right" className="slop-creator-part-svg" />
            </div>
            <div className="slop-creator-part slop-creator-part-arm1" style={getIdlePartStyle("arm1")}>
              <div className="slop-creator-arm-swing slop-creator-arm-swing-left" style={getArmSwingStyle("left")}>
                <SlopArmSvg variant="right" className="slop-creator-part-svg" />
              </div>
            </div>
            <div className="slop-creator-part slop-creator-part-body" style={getIdlePartStyle("body")}>
              <SlopBodySvg className="slop-creator-part-svg" />
            </div>
            {selectedShirt.asset ? (
              <div className="slop-creator-part slop-creator-part-shirt" style={getIdlePartStyle("shirt")}>
                <Image src={selectedShirt.asset} alt="" fill unoptimized className="slop-creator-part-image" />
              </div>
            ) : null}
            {selectedPants.asset ? (
              <div className="slop-creator-part slop-creator-part-pants" style={getIdlePartStyle("pants")}>
                <Image src={selectedPants.asset} alt="" fill unoptimized className="slop-creator-part-image" />
              </div>
            ) : null}
            <div className="slop-creator-part slop-creator-part-arm2" style={getIdlePartStyle("arm2")}>
              <div className="slop-creator-arm-swing slop-creator-arm-swing-right" style={getArmSwingStyle("right")}>
                <SlopArmSvg variant="left" className="slop-creator-part-svg" />
              </div>
            </div>
            <div className="slop-creator-part slop-creator-part-head" style={getIdlePartStyle("head")}>
              <SlopHeadSvg className="slop-creator-part-svg" />
            </div>
            <div className="slop-creator-part slop-creator-part-eyes" style={getIdlePartStyle("eyes")}>
              <span className={`slop-creator-face-layer${isBlinking ? " is-blinking" : ""}`}>
                <Image src={selectedEyes.asset} alt="" fill unoptimized className="slop-creator-part-image" />
              </span>
            </div>
            <div className="slop-creator-part slop-creator-part-mouth" style={getIdlePartStyle("mouth")}>
              <Image src={selectedMouth.asset} alt="" fill unoptimized className="slop-creator-part-image" />
            </div>
            {selectedAccessory.asset ? (
              <div className="slop-creator-part slop-creator-part-accessory" style={getIdlePartStyle("accessory")}>
                <Image src={selectedAccessory.asset} alt="" fill unoptimized className="slop-creator-part-image" />
              </div>
            ) : null}
          </div>
        </div>

        <div className="slop-creator-bottom-dock" aria-label="Primary creator navigation">
          {dockItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`slop-creator-dock-item${item.isActive ? " is-active" : ""}`}
              aria-pressed={item.isActive ? true : undefined}
            >
              <span className={`slop-creator-dock-icon slop-creator-dock-icon-${item.key}`} aria-hidden="true" />
              <span className="slop-creator-dock-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
