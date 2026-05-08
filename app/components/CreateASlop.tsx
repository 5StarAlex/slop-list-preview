"use client";

import Image from "next/image";
import Link from "next/link";
import { CSSProperties, useMemo, useState } from "react";
import { useAccount } from "./AccountProvider";
import { SlopArmSvg, SlopBodySvg, SlopHeadSvg, SlopLegSvg } from "./SlopBodyParts";
import {
  creationCategories,
  customizationOptions,
  inventoryCategories,
  slopTypeOptions,
  statsCategories,
  type CharacterConfig,
  type ConfigurableCategoryKey,
  type CreationCategoryKey,
  type CustomizationOption,
  type InventoryCategoryKey,
  type StatsCategoryKey,
} from "./slopOptions";

const pageOptions = [
  { key: "inventory", label: "Inventory", icon: "bag" },
  { key: "creation", label: "Creation", icon: "easel" },
  { key: "stats", label: "Stats", icon: "bars" },
] as const;

const pageTitles = {
  inventory: "INVENTORY",
  creation: "CREATION",
  stats: "STATS",
} as const;

const pageAmount = "14/100";

const basePose = {
  leg1: { x: -28, y: 10, rotate: 0, scale: 0.58 },
  leg2: { x: 28, y: 10, rotate: 0, scale: 0.58 },
  arm1: { x: -30, y: -66, rotate: -2, scale: 0.68 },
  body: { x: 0, y: -70, rotate: 0, scale: 0.64 },
  shirt: { x: 0, y: -70, rotate: 0, scale: 0.64 },
  pants: { x: 0, y: -33, rotate: 0, scale: 0.58 },
  arm2: { x: 30, y: -66, rotate: 2, scale: 0.68 },
  head: { x: 0, y: -133, rotate: 0, scale: 0.56 },
  eyes: { x: 0, y: -133, rotate: 0, scale: 0.56 },
  mouth: { x: 0, y: -124, rotate: 0, scale: 0.56 },
  accessory: { x: 0, y: -133, rotate: 0, scale: 0.56 },
} as const;

const bubbleSlots = [
  { key: "eyes", className: "is-left-top" },
  { key: "mouth", className: "is-left-middle" },
  { key: "color", className: "is-left-bottom" },
  { key: "shirt", className: "is-right-top" },
  { key: "pants", className: "is-right-middle" },
  { key: "accessories", className: "is-right-bottom" },
] as const;

type CreatorPageKey = (typeof pageOptions)[number]["key"];
type PosePartKey = keyof typeof basePose;

function getPanelOptions(page: CreatorPageKey, creationKey: CreationCategoryKey, inventoryKey: InventoryCategoryKey) {
  if (page === "creation") {
    return customizationOptions[creationKey];
  }

  if (page === "inventory") {
    return customizationOptions[inventoryKey];
  }

  return [];
}

function getOptionLabel(categoryKey: ConfigurableCategoryKey, option: CustomizationOption) {
  if (categoryKey === "color" && "className" in option) {
    return `${option.label} Theme`;
  }

  return option.label;
}

function PreviewGlyph({
  option,
  categoryKey,
  colorClassName,
}: {
  option: CustomizationOption;
  categoryKey: ConfigurableCategoryKey;
  colorClassName: string;
}) {
  if ("className" in option) {
    return (
      <span className={`slop-create-swatch ${option.className}`} aria-hidden="true">
        <span className="slop-create-swatch-core" />
      </span>
    );
  }

  if (option.asset) {
    return (
      <span className="slop-create-asset-preview" aria-hidden="true">
        <Image src={option.asset} alt="" fill unoptimized className="slop-create-asset-image" />
      </span>
    );
  }

  return <span className={`slop-create-placeholder-icon is-${categoryKey} ${colorClassName}`} aria-hidden="true" />;
}

function WindowAction({ label }: { label: string }) {
  return (
    <button type="button" className="slop-create-window-button" aria-label={label}>
      <span aria-hidden="true">{label}</span>
    </button>
  );
}

function CategoryIcon({ icon }: { icon: string }) {
  return <span className={`slop-create-symbol is-${icon}`} aria-hidden="true" />;
}

export default function CreateASlop() {
  const { account, updateCharacterConfig } = useAccount();
  const [activePage, setActivePage] = useState<CreatorPageKey>("inventory");
  const [activeCreationCategory, setActiveCreationCategory] = useState<CreationCategoryKey>("eyes");
  const [activeInventoryCategory, setActiveInventoryCategory] = useState<InventoryCategoryKey>("shirt");
  const [activeStatsCategory, setActiveStatsCategory] = useState<StatsCategoryKey>("type");
  const characterConfig = account.characterConfig;

  const selectedEyes = customizationOptions.eyes[characterConfig.eyes];
  const selectedMouth = customizationOptions.mouth[characterConfig.mouth];
  const selectedShirt = customizationOptions.shirt[characterConfig.shirt];
  const selectedPants = customizationOptions.pants[characterConfig.pants];
  const selectedAccessory = customizationOptions.accessories[characterConfig.accessories];
  const selectedColor = customizationOptions.color[characterConfig.color];
  const selectedSlopType = slopTypeOptions[characterConfig.slopType];

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

  const activePanelCategory = activePage === "creation" ? activeCreationCategory : activeInventoryCategory;
  const activePanelOptions = getPanelOptions(activePage, activeCreationCategory, activeInventoryCategory);

  function getIdlePartStyle(partKey: PosePartKey): CSSProperties {
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

  function updateConfig(patch: Partial<CharacterConfig>) {
    updateCharacterConfig({
      ...characterConfig,
      ...patch,
    });
  }

  function selectOption(categoryKey: ConfigurableCategoryKey, nextIndex: number) {
    updateConfig({
      [categoryKey]: nextIndex,
    } as Partial<CharacterConfig>);
  }

  const bubbleOptions = {
    eyes: selectedEyes,
    mouth: selectedMouth,
    color: selectedColor,
    shirt: selectedShirt,
    pants: selectedPants,
    accessories: selectedAccessory,
  } as const;

  return (
    <section className="slop-create-page">
      <div className="slop-create-bg" aria-hidden="true">
        <div className="slop-create-bg-sweep is-pink" />
        <div className="slop-create-bg-sweep is-blue" />
        <div className="slop-create-bg-grid" />
        <div className="slop-create-bg-stars" />
      </div>

      <div className="slop-create-topbar">
        <div className="slop-create-topbar-left">
          <Link href="/" className="slop-create-back-button" aria-label="Back to home">
            <span aria-hidden="true">{"\u2190"}</span>
          </Link>
          <div className="slop-create-title-stack">
            <h1 className="slop-create-title">Slop Studio</h1>
            <p className="slop-create-subtitle">{pageTitles[activePage]}</p>
          </div>
        </div>

        <div className="slop-create-topbar-right">
          <div className="slop-create-coin-pill">
            <span className="slop-create-coin-icon" aria-hidden="true">
              {"\u2605"}
            </span>
            <strong>{account.economy.coins.toLocaleString()}</strong>
          </div>
          <div className="slop-create-window-actions" aria-label="Window actions">
            <WindowAction label={"\u2212"} />
            <WindowAction label={"\u00D7"} />
            <WindowAction label={"\u00D7"} />
          </div>
        </div>
      </div>

      <div className="slop-create-layout">
        <div className="slop-create-character-zone">
          <div className="slop-create-character-backdrop" aria-hidden="true" />
          <div className="slop-create-character-spotlight" aria-hidden="true" />

          <div className="slop-create-character-preview">
            <div className={characterThemeClass} style={characterThemeStyle} aria-label="Current slop character preview">
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
                {selectedEyes.asset ? (
                  <span className="slop-creator-face-layer">
                    <Image src={selectedEyes.asset} alt="" fill unoptimized className="slop-creator-part-image" />
                  </span>
                ) : null}
              </div>
              <div className="slop-creator-part slop-creator-part-mouth" style={getIdlePartStyle("mouth")}>
                {selectedMouth.asset ? <Image src={selectedMouth.asset} alt="" fill unoptimized className="slop-creator-part-image" /> : null}
              </div>
              {selectedAccessory.asset ? (
                <div className="slop-creator-part slop-creator-part-accessory" style={getIdlePartStyle("accessory")}>
                  <Image src={selectedAccessory.asset} alt="" fill unoptimized className="slop-creator-part-image" />
                </div>
              ) : null}
            </div>
          </div>

          <div className="slop-create-character-pedestal" aria-hidden="true" />

          {bubbleSlots.map((bubble) => (
            <div key={bubble.key} className={`slop-create-character-bubble ${bubble.className}`}>
              <span className="slop-create-bubble-star" aria-hidden="true">
                {"\u2605"}
              </span>
              <PreviewGlyph
                option={bubbleOptions[bubble.key]}
                categoryKey={bubble.key}
                colorClassName={selectedColor.className}
              />
            </div>
          ))}
        </div>

        <div className="slop-create-panel-shell">
          <section className="slop-create-panel">
            {activePage === "stats" ? (
              <>
                <div className="slop-create-stats-header">
                  <div>
                    <p className="slop-create-panel-kicker">Choose Your Type</p>
                    <h2 className="slop-create-panel-title">Power Loadout</h2>
                  </div>
                  <span className="slop-create-mini-chip">Focus: {activeStatsCategory}</span>
                </div>

                <div className="slop-create-stats-type-grid">
                  {slopTypeOptions.map((typeOption, index) => (
                    <button
                      key={typeOption.key}
                      type="button"
                      className={`slop-create-type-card ${typeOption.accentClass}${
                        characterConfig.slopType === index ? " is-selected" : ""
                      }`}
                      onClick={() => updateConfig({ slopType: index as CharacterConfig["slopType"] })}
                    >
                      <span className="slop-create-type-badge" aria-hidden="true">
                        {"\u2605"}
                      </span>
                      <div className="slop-create-type-illustration" aria-hidden="true" />
                      <strong>{typeOption.label}</strong>
                      <p>{typeOption.description}</p>
                    </button>
                  ))}
                </div>

                <div className="slop-create-stats-section">
                  <h3 className="slop-create-stats-section-title">Abilities</h3>
                  <div className="slop-create-ability-row">
                    {selectedSlopType.abilities.map((ability) => (
                      <article key={ability.id} className="slop-create-ability-card">
                        <span className={`slop-create-ability-icon is-${ability.id}`} aria-hidden="true" />
                        <strong>{ability.label}</strong>
                        <span>Lv. {ability.level}</span>
                      </article>
                    ))}
                    <article className="slop-create-ability-card is-locked">
                      <span className="slop-create-ability-lock" aria-hidden="true">
                        {"\u25A3"}
                      </span>
                      <strong>Locked</strong>
                      <span>Slot</span>
                    </article>
                  </div>
                </div>

                <div className="slop-create-stats-footer">
                  <div className="slop-create-stats-block">
                    <h3 className="slop-create-stats-section-title">Stats</h3>
                    {Object.entries(selectedSlopType.stats).map(([statKey, value]) => (
                      <div key={statKey} className="slop-create-stat-row">
                        <span className="slop-create-stat-label">{statKey}</span>
                        <div className="slop-create-stat-bar">
                          <span className={`slop-create-stat-fill is-${statKey}`} style={{ width: `${value}%` }} aria-hidden="true" />
                        </div>
                        <strong className="slop-create-stat-value">{value}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="slop-create-points-card">
                    <span className="slop-create-points-label">Points Available</span>
                    <strong className="slop-create-points-value">{selectedSlopType.pointsAvailable}</strong>
                    <button type="button" className="slop-create-points-button" aria-label="Add points">
                      +
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="slop-create-panel-head">
                  <div className="slop-create-amount-wrap">
                    <span className="slop-create-amount-label">Amount</span>
                    <strong className="slop-create-amount-value">{pageAmount}</strong>
                  </div>
                  <div className="slop-create-panel-rule" aria-hidden="true" />
                </div>

                <div className="slop-create-grid">
                  {activePanelOptions.map((option, index) => {
                    const isSelected = characterConfig[activePanelCategory] === index;

                    return (
                      <button
                        key={`${activePanelCategory}-${option.id}`}
                        type="button"
                        className={`slop-create-option-card${isSelected ? " is-selected" : ""}${
                          activePage === "inventory" ? " is-inventory" : " is-creation"
                        }`}
                        onClick={() => selectOption(activePanelCategory, index)}
                      >
                        <span className={`slop-create-option-badge${activePage === "inventory" ? " is-check" : ""}`} aria-hidden="true">
                          {activePage === "inventory" ? "\u2713" : "\u2605"}
                        </span>
                        <div className="slop-create-option-preview">
                          <PreviewGlyph option={option} categoryKey={activePanelCategory} colorClassName={selectedColor.className} />
                        </div>
                        <strong className="slop-create-option-title">{getOptionLabel(activePanelCategory, option)}</strong>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </section>

          <div className="slop-create-side-tabs" role="tablist" aria-label="Section tabs">
            {(activePage === "creation" ? creationCategories : activePage === "inventory" ? inventoryCategories : statsCategories).map(
              (category) => {
                const isActive =
                  activePage === "creation"
                    ? activeCreationCategory === category.key
                    : activePage === "inventory"
                      ? activeInventoryCategory === category.key
                      : activeStatsCategory === category.key;

                return (
                  <button
                    key={category.key}
                    type="button"
                    className={`slop-create-side-tab${isActive ? " is-active" : ""}`}
                    onClick={() => {
                      if (activePage === "creation") {
                        setActiveCreationCategory(category.key as CreationCategoryKey);
                        return;
                      }

                      if (activePage === "inventory") {
                        setActiveInventoryCategory(category.key as InventoryCategoryKey);
                        return;
                      }

                      setActiveStatsCategory(category.key as StatsCategoryKey);
                    }}
                    aria-pressed={isActive}
                  >
                    <CategoryIcon icon={category.icon} />
                  </button>
                );
              },
            )}
          </div>
        </div>
      </div>

      <nav className="slop-create-bottom-nav slop-create-bottom-nav--creator" aria-label="Create a Slop pages">
        {pageOptions.map((page) => (
          <button
            key={page.key}
            type="button"
            className={`slop-create-bottom-button${activePage === page.key ? " is-active" : ""}`}
            onClick={() => setActivePage(page.key)}
          >
            <CategoryIcon icon={page.icon} />
            <span>{page.label}</span>
          </button>
        ))}
      </nav>
    </section>
  );
}
