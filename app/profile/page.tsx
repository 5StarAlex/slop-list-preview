"use client";

import Image from "next/image";
import { type CSSProperties, useMemo, useState } from "react";
import ComicShell from "../components/ComicShell";
import { useAccount } from "../components/AccountProvider";
import { SlopArmSvg, SlopBodySvg, SlopHeadSvg, SlopLegSvg } from "../components/SlopBodyParts";
import { customizationOptions, type CharacterConfig } from "../components/slopOptions";

type StudioMode = "colors" | "inventory" | "stats";
type ColorSlot = "head" | "body" | "arms" | "legs" | "outline" | "face" | "platformGlow";
type PaintMode = "solid" | "gradient" | "pattern";
type InventoryCategory = "all" | "shirts" | "pants" | "crowns" | "eyes" | "backdrops" | "shoes";
type StatsTab = "items" | "powerups" | "stats";

type StudioColors = Record<ColorSlot, string>;

type InventoryItem = {
  id: string;
  name: string;
  category: Exclude<InventoryCategory, "all">;
  rarity: "common" | "uncommon" | "rare" | "epic";
  owned: boolean;
  art: "hoodie" | "pants" | "crown" | "eyes" | "body" | "backdrop" | "shoes";
};

type RewardItem = {
  id: string;
  name: string;
  rarity: "common" | "uncommon" | "rare" | "epic";
  source: string;
  art: "ray" | "bazooka" | "banana" | "shield" | "jetpack" | "sneakers" | "goo" | "grenade";
};

type StatBoosts = Record<(typeof statsRows)[number][0], number>;

const defaultStudioColors: StudioColors = {
  head: "#e4e4e4",
  body: "#ffffff",
  arms: "#ffffff",
  legs: "#ffffff",
  outline: "#3d3d3d",
  face: "#11131a",
  platformGlow: "#d26df0",
};

const colorSlots: Array<{ key: ColorSlot; label: string }> = [
  { key: "head", label: "Head" },
  { key: "body", label: "Body" },
  { key: "arms", label: "Arms" },
  { key: "legs", label: "Legs" },
  { key: "outline", label: "Outline" },
  { key: "face", label: "Face / Eyes" },
  { key: "platformGlow", label: "Platform Glow" },
];

const colorSwatches = [
  "#000000", "#ffffff", "#d9d9d9", "#b91c1c", "#dc2626", "#ef3b24", "#f1662e", "#f4872d", "#f7a24c", "#f5bb6a", "#f8e7a1",
  "#cfcfcf", "#c9a500", "#dfb914", "#f4ca1e", "#f5f51c", "#e9fa35", "#daf65c", "#d4f987", "#cef49c",
  "#48bf87", "#32c726", "#42df30", "#4de339", "#61dd53", "#6bd96b", "#98e3ac", "#a8e5bd", "#77c8a8",
  "#3594dc", "#2a82bd", "#39a1d6", "#48b4e5", "#55bce9", "#62b6e7", "#80b7ec", "#96b2ed", "#9db7ee",
  "#1521ff", "#2f2edc", "#452fe2", "#552ee4", "#6937e9", "#7a3fe8", "#8d4ae9", "#9c54e5", "#af62e4",
  "#c725e7", "#9e25c3", "#b92ab9", "#c733bd", "#d23cc5", "#d34ccc", "#d966cf", "#e285d6", "#e8a9df",
  "#df3da8", "#7b3514", "#89431f", "#9b5a2f", "#9e7250", "#987562", "#aa9183", "#b8a69c", "#c9c2bf",
];

const inventoryCategories: Array<{ key: InventoryCategory; label: string }> = [
  { key: "all", label: "All" },
  { key: "shirts", label: "Shirts" },
  { key: "pants", label: "Pants" },
  { key: "crowns", label: "Crowns" },
  { key: "eyes", label: "Eyes" },
  { key: "backdrops", label: "Backdrops" },
  { key: "shoes", label: "Shoes" },
];

const inventoryItems: InventoryItem[] = [
  { id: "neon-drip-hoodie", name: "Neon Drip Hoodie", category: "shirts", rarity: "uncommon", owned: true, art: "hoodie" },
  { id: "galaxy-pajama-pants", name: "Galaxy Pajama Pants", category: "pants", rarity: "rare", owned: true, art: "pants" },
  { id: "slop-king-crown", name: "Slop King Crown", category: "crowns", rarity: "epic", owned: true, art: "crown" },
  { id: "sleepy-slop-eyes", name: "Sleepy Slop Eyes", category: "eyes", rarity: "epic", owned: true, art: "eyes" },
  { id: "plain-slop-body", name: "Plain Slop Body", category: "shirts", rarity: "uncommon", owned: true, art: "body" },
  { id: "plain-slop-pants", name: "Plain Slop Pants", category: "pants", rarity: "rare", owned: true, art: "body" },
  { id: "neon-void", name: "Neon Void", category: "backdrops", rarity: "epic", owned: true, art: "backdrop" },
  { id: "slop-sneakers", name: "Slop Sneakers", category: "shoes", rarity: "uncommon", owned: true, art: "shoes" },
];

const rewardItems: RewardItem[] = [
  { id: "slop-ray-gun", name: "Slop Ray Gun", rarity: "epic", source: "Slop Battle", art: "ray" },
  { id: "cheesy-bazooka", name: "Cheesy Bazooka", rarity: "rare", source: "Cheddar Clash", art: "bazooka" },
  { id: "banana-peel", name: "Banana Peel", rarity: "common", source: "Slippery Slope", art: "banana" },
  { id: "slop-shield", name: "Slop Shield", rarity: "epic", source: "Slop Siege", art: "shield" },
  { id: "jetpack", name: "Jetpack", rarity: "rare", source: "Sky Slop", art: "jetpack" },
  { id: "speed-sneakers", name: "Speed Sneakers", rarity: "uncommon", source: "Quick Slop", art: "sneakers" },
  { id: "gravity-goo", name: "Gravity Goo", rarity: "rare", source: "Gravity Pit", art: "goo" },
  { id: "slop-grenade", name: "Slop Grenade", rarity: "epic", source: "Slop Mayhem", art: "grenade" },
];

const topModes: Array<{ key: StudioMode; label: string; icon: string; iconSrc: string }> = [
  { key: "colors", label: "Colors", icon: "palette", iconSrc: "/assets/create-slop-tabs/color-tab.png" },
  { key: "inventory", label: "Inventory", icon: "shirt", iconSrc: "/assets/create-slop-tabs/inventory.png" },
  { key: "stats", label: "Stats", icon: "runner", iconSrc: "/assets/create-slop-tabs/stats-and-more.png" },
];

const statsRows = [
  ["Attack", 72],
  ["Defense", 66],
  ["Speed", 84],
  ["Magic", 58],
] as const;

function iconLabel(mode: StudioMode) {
  return topModes.find((item) => item.key === mode)?.label ?? "Colors";
}

function studioModeForSlot(slot: ColorSlot | InventoryCategory | StatsTab): StudioMode {
  if (["head", "body", "arms", "legs", "outline", "face", "platformGlow"].includes(slot)) {
    return "colors";
  }

  return "inventory";
}

function randomColor() {
  return colorSwatches[Math.floor(Math.random() * colorSwatches.length)] ?? "#ffffff";
}

function isValidHex(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function hexToRgb(hex: string) {
  const cleanHex = hex.replace("#", "");
  return {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0")).join("")}`;
}

function shiftColor(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r + amount, g + amount, b + amount);
}

function colorFromHue(hue: number) {
  const value = Math.max(0, Math.min(360, hue));
  const chroma = 1;
  const x = chroma * (1 - Math.abs(((value / 60) % 2) - 1));
  const [r, g, b] =
    value < 60 ? [chroma, x, 0] :
    value < 120 ? [x, chroma, 0] :
    value < 180 ? [0, chroma, x] :
    value < 240 ? [0, x, chroma] :
    value < 300 ? [x, 0, chroma] :
    [chroma, 0, x];

  return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}

function inventoryCategoryForRail(item: string): InventoryCategory {
  if (item === "shirt") return "shirts";
  if (item === "pants") return "pants";
  if (item === "crown") return "crowns";
  if (item === "eyes") return "eyes";
  if (item === "backdrop") return "backdrops";
  if (item === "shoes") return "shoes";
  return "all";
}

function MiniIcon({ type }: { type: string }) {
  return <span className={`slop-studio-icon-art is-${type}`} aria-hidden="true" />;
}

function ModeIcon({ type, src }: { type: string; src: string }) {
  return (
    <span className={`slop-studio-mode-image is-${type}`} aria-hidden="true">
      <Image src={src} alt="" fill sizes="96px" unoptimized />
    </span>
  );
}

function StudioCharacter({
  colors,
  config,
  equippedItems,
  paintMode,
  pulseKey,
}: {
  colors: StudioColors;
  config: CharacterConfig;
  equippedItems: InventoryItem[];
  paintMode: PaintMode;
  pulseKey: number;
}) {
  const selectedEyes = customizationOptions.eyes[config.eyes];
  const selectedMouth = customizationOptions.mouth[config.mouth];
  const equippedArt = new Set(equippedItems.map((item) => item.art));
  const style = {
    "--studio-head-fill": colors.head,
    "--studio-body-fill": colors.body,
    "--studio-arms-fill": colors.arms,
    "--studio-legs-fill": colors.legs,
    "--studio-outline": colors.outline,
    "--studio-face": colors.face,
    "--studio-glow": colors.platformGlow,
  } as CSSProperties;

  return (
    <div className={`slop-studio-character-shell is-${paintMode}`} style={style} data-pulse={pulseKey}>
      {equippedArt.has("backdrop") ? <span className="slop-studio-backdrop-effect" aria-hidden="true" /> : null}
      <div className="slop-studio-character" aria-label="Create-A-Slop character preview">
        <div className="slop-studio-part slop-studio-leg is-left">
          <SlopLegSvg variant="left" className="slop-studio-svg" />
        </div>
        <div className="slop-studio-part slop-studio-leg is-right">
          <SlopLegSvg variant="right" className="slop-studio-svg" />
        </div>
        <div className="slop-studio-part slop-studio-arm is-left">
          <SlopArmSvg variant="right" className="slop-studio-svg" />
        </div>
        <div className="slop-studio-part slop-studio-body">
          <SlopBodySvg className="slop-studio-svg" />
        </div>
        {equippedArt.has("hoodie") ? <span className="slop-studio-wearable is-hoodie" aria-hidden="true" /> : null}
        {equippedArt.has("body") ? <span className="slop-studio-wearable is-plain-body" aria-hidden="true" /> : null}
        {equippedArt.has("pants") ? <span className="slop-studio-wearable is-pants" aria-hidden="true" /> : null}
        {equippedArt.has("shoes") ? <span className="slop-studio-wearable is-shoes" aria-hidden="true" /> : null}
        <div className="slop-studio-part slop-studio-arm is-right">
          <SlopArmSvg variant="left" className="slop-studio-svg" />
        </div>
        <div className="slop-studio-part slop-studio-head">
          <SlopHeadSvg className="slop-studio-svg" />
        </div>
        {equippedArt.has("crown") ? <span className="slop-studio-wearable is-crown" aria-hidden="true" /> : null}
        <div className="slop-studio-part slop-studio-eyes">
          {selectedEyes.asset ? <Image src={selectedEyes.asset} alt="" fill unoptimized /> : null}
        </div>
        <div className="slop-studio-part slop-studio-mouth">
          {selectedMouth.asset ? <Image src={selectedMouth.asset} alt="" fill unoptimized /> : null}
        </div>
      </div>
      <span className="slop-studio-platform" aria-hidden="true" />
    </div>
  );
}

function InventoryArt({ type }: { type: InventoryItem["art"] | RewardItem["art"] }) {
  return <span className={`slop-item-art is-${type}`} aria-hidden="true" />;
}

export default function ProfilePage() {
  const { account, updateCharacterConfig } = useAccount();
  const [mode, setMode] = useState<StudioMode>("colors");
  const [activeColorSlot, setActiveColorSlot] = useState<ColorSlot>("head");
  const [paintMode, setPaintMode] = useState<PaintMode>("solid");
  const [colors, setColors] = useState<StudioColors>(defaultStudioColors);
  const [hue, setHue] = useState(272);
  const [alpha, setAlpha] = useState(100);
  const [inventoryCategory, setInventoryCategory] = useState<InventoryCategory>("all");
  const [equippedItems, setEquippedItems] = useState<string[]>(["neon-drip-hoodie", "galaxy-pajama-pants", "slop-king-crown", "sleepy-slop-eyes", "plain-slop-body", "neon-void", "slop-sneakers"]);
  const [statsTab, setStatsTab] = useState<StatsTab>("items");
  const [equippedRewards, setEquippedRewards] = useState<string[]>(["slop-ray-gun", "jetpack", "slop-shield"]);
  const [statBoosts, setStatBoosts] = useState<StatBoosts>({ Attack: 0, Defense: 0, Speed: 0, Magic: 0 });
  const [pulseKey, setPulseKey] = useState(0);
  const [hexDraft, setHexDraft] = useState(defaultStudioColors.head.toUpperCase());

  const visibleInventory = useMemo(
    () => inventoryItems.filter((item) => inventoryCategory === "all" || item.category === inventoryCategory),
    [inventoryCategory],
  );
  const equippedInventoryItems = useMemo(
    () => equippedItems.map((itemId) => inventoryItems.find((entry) => entry.id === itemId)).filter((item): item is InventoryItem => Boolean(item)),
    [equippedItems],
  );
  const activeHex = colors[activeColorSlot].toUpperCase();

  const wakePreview = () => setPulseKey((current) => current + 1);

  const setSlotColor = (slot: ColorSlot, color: string, modeOverride = paintMode) => {
    if (!isValidHex(color)) {
      return;
    }

    setColors((current) => {
      if (modeOverride === "gradient") {
        if (slot === "body") {
          return { ...current, body: color, arms: shiftColor(color, 22), legs: shiftColor(color, -18) };
        }

        if (slot === "head") {
          return { ...current, head: color, face: current.face };
        }

        return { ...current, [slot]: color, platformGlow: shiftColor(color, 34) };
      }

      if (modeOverride === "pattern") {
        if (slot === "outline") {
          return { ...current, outline: color, face: color };
        }

        return { ...current, [slot]: color, outline: shiftColor(color, -76), platformGlow: shiftColor(color, 40) };
      }

      return { ...current, [slot]: color };
    });
    setHexDraft(color.toUpperCase());
    wakePreview();
  };

  const randomizeColors = () => {
    setColors({
      head: randomColor(),
      body: "#ffffff",
      arms: "#ffffff",
      legs: "#ffffff",
      outline: "#3f3f3f",
      face: "#11131a",
      platformGlow: randomColor(),
    });
    setHue(Math.floor(Math.random() * 361));
    setAlpha(100);
    wakePreview();
  };

  const applyHue = (value: number) => {
    setHue(value);
    setSlotColor(activeColorSlot, colorFromHue(value));
  };

  const applyHexDraft = (value: string) => {
    setHexDraft(value.toUpperCase());
    if (isValidHex(value)) {
      setSlotColor(activeColorSlot, value);
    }
  };

  const equipItem = (item: InventoryItem) => {
    setEquippedItems((current) => {
      if (current.includes(item.id)) {
        wakePreview();
        return current.filter((itemId) => itemId !== item.id);
      }

      const nextItems = current.filter((itemId) => {
        const currentItem = inventoryItems.find((entry) => entry.id === itemId);
        return currentItem?.category !== item.category;
      });
      wakePreview();
      return [...nextItems, item.id];
    });

    if (item.category === "eyes") {
      updateCharacterConfig({ ...account.characterConfig, eyes: 1 });
    }

    if (item.category === "shirts") {
      updateCharacterConfig({ ...account.characterConfig, shirt: 1 });
    }

    if (item.category === "pants") {
      updateCharacterConfig({ ...account.characterConfig, pants: 1 });
    }

    if (item.category === "crowns") {
      updateCharacterConfig({ ...account.characterConfig, accessories: 1 });
    }
  };

  const removeEquippedItem = (itemId: string) => {
    setEquippedItems((current) => current.filter((entry) => entry !== itemId));
    wakePreview();
  };

  const toggleReward = (item: RewardItem) => {
    setEquippedRewards((current) => {
      if (current.includes(item.id)) {
        return current.filter((itemId) => itemId !== item.id);
      }

      return [...current.slice(-2), item.id];
    });
  };

  const trainStat = (label: (typeof statsRows)[number][0]) => {
    setStatBoosts((current) => ({ ...current, [label]: Math.min(15, current[label] + 3) }));
    wakePreview();
  };

  return (
    <ComicShell className="slop-studio-page">
      <main className="slop-studio-shell">
        <section className="slop-studio-preview-panel">
          <h1>Create-A-Slop</h1>
          <div className="slop-studio-stage">
            <nav className="slop-studio-side-rail" aria-label="Quick customization shortcuts">
              {(["head", "shirt", "pants", "crown", "eyes", "backdrop", "shoes"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={mode === studioModeForSlot(item as ColorSlot | InventoryCategory | StatsTab) ? "is-active" : ""}
                  onClick={() => {
                    if (item === "head") {
                      setMode("colors");
                      setActiveColorSlot("head");
                    } else if (item === "eyes") {
                      setMode("colors");
                      setActiveColorSlot("face");
                    } else {
                      setMode("inventory");
                      setInventoryCategory(inventoryCategoryForRail(item));
                    }
                  }}
                  aria-label={item}
                >
                  <MiniIcon type={item} />
                </button>
              ))}
            </nav>
            <StudioCharacter
              colors={colors}
              config={account.characterConfig}
              equippedItems={equippedInventoryItems}
              paintMode={paintMode}
              pulseKey={pulseKey}
            />
          </div>
          <button type="button" className="slop-randomize-button" onClick={randomizeColors}>
            <span aria-hidden="true">✦</span> Randomize Colors
          </button>
        </section>

        <section className="slop-studio-editor-panel">
          <header className="slop-studio-editor-head">
            <h2>Customize Your Slop</h2>
            <span aria-hidden="true" />
          </header>

          <nav className="slop-studio-mode-tabs" aria-label="Customize your slop">
            {topModes.map((item) => (
              <button
                key={item.key}
                type="button"
                data-studio-mode={item.key}
                className={mode === item.key ? "is-active" : ""}
                onClick={() => setMode(item.key)}
              >
                <ModeIcon type={item.icon} src={item.iconSrc} />
                <strong>{item.label}</strong>
              </button>
            ))}
          </nav>

          <div className="slop-studio-mode-label">
            <strong>{iconLabel(mode)}</strong>
          </div>

          {mode === "colors" ? (
            <section className="slop-studio-workspace is-colors">
              <div className="slop-color-slot-list">
                {colorSlots.map((slot) => (
                  <button
                    key={slot.key}
                    type="button"
                    className={activeColorSlot === slot.key ? "is-active" : ""}
                    onClick={() => {
                      setActiveColorSlot(slot.key);
                      setHexDraft(colors[slot.key].toUpperCase());
                    }}
                  >
                    <span style={{ background: colors[slot.key] }} />
                    <strong>{slot.label}</strong>
                    <em>v</em>
                  </button>
                ))}
              </div>
              <div className="slop-paint-panel">
                <div className="slop-paint-tabs">
                  {(["solid", "gradient", "pattern"] as const).map((tab) => (
                    <button key={tab} type="button" className={paintMode === tab ? "is-active" : ""} onClick={() => setPaintMode(tab)}>
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="slop-swatch-grid">
                  {colorSwatches.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={colors[activeColorSlot].toLowerCase() === color.toLowerCase() ? "is-active" : ""}
                      style={{ background: color }}
                      onClick={() => setSlotColor(activeColorSlot, color)}
                      aria-label={color}
                    />
                  ))}
                </div>
                <label className="slop-live-slider is-hue">
                  <span>Hue</span>
                  <input type="range" min="0" max="360" value={hue} onChange={(event) => applyHue(Number(event.target.value))} />
                </label>
                <div className="slop-alpha-row">
                  <label className="slop-live-slider is-alpha" style={{ "--active-alpha": alpha / 100, "--active-color": activeHex } as CSSProperties}>
                    <span>Glow</span>
                    <input type="range" min="10" max="100" value={alpha} onChange={(event) => setAlpha(Number(event.target.value))} />
                  </label>
                  <input value={hexDraft} onChange={(event) => applyHexDraft(event.target.value)} aria-label="Hex color" />
                </div>
              </div>
            </section>
          ) : null}

          {mode === "inventory" ? (
            <section className="slop-studio-workspace is-inventory">
              <nav className="slop-inventory-tabs" aria-label="Inventory categories">
                {inventoryCategories.map((category) => (
                  <button
                    key={category.key}
                    type="button"
                    className={inventoryCategory === category.key ? "is-active" : ""}
                    onClick={() => setInventoryCategory(category.key)}
                  >
                    {category.label}
                  </button>
                ))}
              </nav>
              <div className="slop-inventory-grid">
                {visibleInventory.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`slop-inventory-card is-${item.rarity} ${equippedItems.includes(item.id) ? "is-equipped" : ""}`}
                    onClick={() => equipItem(item)}
                  >
                    <span className="slop-inventory-art-frame">
                      <InventoryArt type={item.art} />
                    </span>
                    <strong>{item.name}</strong>
                    <em>{item.category.slice(0, -1).toUpperCase()}</em>
                    <span>{equippedItems.includes(item.id) ? "Equipped" : item.owned ? "Equip" : "Locked"}</span>
                  </button>
                ))}
              </div>
              <div className="slop-fit-strip">
                <div>
                  <strong>Your Fit</strong>
                  <span>{equippedItems.length} items</span>
                </div>
                {equippedItems.slice(0, 7).map((itemId) => {
                  const item = inventoryItems.find((entry) => entry.id === itemId) ?? inventoryItems[0];
                  return (
                    <button key={itemId} type="button" className="slop-fit-slot" onClick={() => removeEquippedItem(itemId)} aria-label={`Remove ${item.name}`}>
                      <InventoryArt type={item.art} />
                    </button>
                  );
                })}
              </div>
            </section>
          ) : null}

          {mode === "stats" ? (
            <section className="slop-studio-workspace is-stats">
              <nav className="slop-stats-tabs" aria-label="Stats tabs">
                {(["items", "powerups", "stats"] as const).map((tab) => (
                  <button key={tab} type="button" className={statsTab === tab ? "is-active" : ""} onClick={() => setStatsTab(tab)}>
                    {tab === "powerups" ? "Power-Ups" : tab}
                  </button>
                ))}
              </nav>
              {statsTab === "stats" ? (
                <div className="slop-stat-board">
                  {statsRows.map(([label, value]) => (
                    <button key={label} type="button" onClick={() => trainStat(label)}>
                      <strong>{label}</strong>
                      <span><i style={{ width: `${Math.min(100, value + statBoosts[label])}%` }} /></span>
                      <em>{value + statBoosts[label]}</em>
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <p className="slop-earned-copy">Earn cool items by playing games and completing challenges!</p>
                  <div className="slop-reward-grid">
                    {rewardItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`slop-reward-card is-${item.rarity} ${equippedRewards.includes(item.id) ? "is-equipped" : ""}`}
                        onClick={() => toggleReward(item)}
                      >
                        <InventoryArt type={item.art} />
                        <strong>{item.name}</strong>
                        <em>{item.rarity}</em>
                        <span>Earned in: {item.source}</span>
                        <mark>{equippedRewards.includes(item.id) ? "Equipped" : "Equip"}</mark>
                      </button>
                    ))}
                  </div>
                </>
              )}
              <div className="slop-equipped-strip">
                <div>
                  <strong>Equipped Items</strong>
                <span>{equippedRewards.length}/3</span>
              </div>
                {equippedRewards.map((itemId) => rewardItems.find((item) => item.id === itemId)).filter((item): item is RewardItem => Boolean(item)).map((item) => (
                  <span key={item.id} className="slop-equipped-slot">
                    <InventoryArt type={item.art} />
                  </span>
                ))}
                <p>Equip items in-game to gain an advantage!</p>
                <button type="button" aria-label="Item info">i</button>
              </div>
            </section>
          ) : null}
        </section>
      </main>
    </ComicShell>
  );
}
