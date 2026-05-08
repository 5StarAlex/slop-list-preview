import eyesAngry from "../Character/eyes_angry.svg";
import eyesSadPlain from "../Character/eyes_sad_plain.svg";
import lashes from "../Character/lashes.svg";
import mouthAngry from "../Character/mouth_angry.svg";
import mouthSemiSad from "../Character/mouth_semi_sad.svg";
import mouthWhistle from "../Character/mouth_whistle.svg";

type AssetValue =
  | typeof eyesAngry
  | typeof eyesSadPlain
  | typeof lashes
  | typeof mouthAngry
  | typeof mouthSemiSad
  | typeof mouthWhistle;

export const creationCategories = [
  { key: "eyes", label: "Eyes", icon: "eye" },
  { key: "mouth", label: "Mouth", icon: "mouth" },
  { key: "color", label: "Color", icon: "palette" },
] as const;

export const inventoryCategories = [
  { key: "shirt", label: "Shirt", icon: "shirt" },
  { key: "pants", label: "Pants", icon: "pants" },
  { key: "accessories", label: "Accessories", icon: "crown" },
] as const;

export const statsCategories = [
  { key: "type", label: "Type", icon: "type" },
  { key: "abilities", label: "Abilities", icon: "bolt" },
  { key: "summary", label: "Summary", icon: "bars" },
] as const;

export type CreationCategoryKey = (typeof creationCategories)[number]["key"];
export type InventoryCategoryKey = (typeof inventoryCategories)[number]["key"];
export type StatsCategoryKey = (typeof statsCategories)[number]["key"];
export type ConfigurableCategoryKey = CreationCategoryKey | InventoryCategoryKey | "pose";
export type SlopTypeKey = "mage" | "speed" | "tank";
export type SlopTypeIndex = 0 | 1 | 2;

type BaseOption = {
  id: string;
  label: string;
  swatchType: "eyes" | "mouth" | "shirt" | "pants" | "accessories" | "color" | "pose";
};

type AssetOption = BaseOption & {
  asset: AssetValue | null;
  className?: never;
  fill?: never;
  stroke?: never;
  highlight?: never;
};

type ColorOption = BaseOption & {
  asset?: never;
  className: string;
  fill: string;
  stroke: string;
  highlight: string;
};

export type CustomizationOption = AssetOption | ColorOption;

export type CharacterConfig = {
  eyes: number;
  mouth: number;
  pose: number;
  shirt: number;
  pants: number;
  accessories: number;
  color: number;
  slopType: SlopTypeIndex;
};

export const defaultCharacterConfig: CharacterConfig = {
  eyes: 0,
  mouth: 0,
  pose: 0,
  shirt: 0,
  pants: 0,
  accessories: 0,
  color: 0,
  slopType: 0,
};

export const eyesOptions = [
  { id: "angry", label: "Battle Brow", asset: eyesAngry, swatchType: "eyes" },
  { id: "sad", label: "Sleepy Side Eye", asset: eyesSadPlain, swatchType: "eyes" },
  { id: "lashed", label: "Star Lashes", asset: lashes, swatchType: "eyes" },
  { id: "angry-elite", label: "Elite Glare", asset: eyesAngry, swatchType: "eyes" },
  { id: "sad-soft", label: "Soft Glance", asset: eyesSadPlain, swatchType: "eyes" },
  { id: "lashed-dream", label: "Dream Wink", asset: lashes, swatchType: "eyes" },
] as const satisfies readonly AssetOption[];

export const mouthOptions = [
  { id: "angry", label: "Grumpy", asset: mouthAngry, swatchType: "mouth" },
  { id: "semi-sad", label: "Lowkey Sad", asset: mouthSemiSad, swatchType: "mouth" },
  { id: "whistle", label: "Whistle", asset: mouthWhistle, swatchType: "mouth" },
  { id: "angry-smirk", label: "Sharp Smirk", asset: mouthAngry, swatchType: "mouth" },
  { id: "semi-sad-droop", label: "Droop", asset: mouthSemiSad, swatchType: "mouth" },
  { id: "whistle-pop", label: "Pop Whistle", asset: mouthWhistle, swatchType: "mouth" },
] as const satisfies readonly AssetOption[];

export const poseOptions = [{ id: "idle", label: "Idle Pose", asset: null, swatchType: "pose" }] as const satisfies readonly AssetOption[];

export const shirtOptions = [
  { id: "none", label: "Blank Tee", asset: null, swatchType: "shirt" },
  { id: "hoodie", label: "Cloud Hoodie", asset: null, swatchType: "shirt" },
  { id: "jacket", label: "Volt Jacket", asset: null, swatchType: "shirt" },
  { id: "blazer", label: "Star Blazer", asset: null, swatchType: "shirt" },
  { id: "crew", label: "Pixel Crew", asset: null, swatchType: "shirt" },
  { id: "armor", label: "Neon Guard", asset: null, swatchType: "shirt" },
] as const satisfies readonly AssetOption[];

export const pantsOptions = [
  { id: "none", label: "Starter Pants", asset: null, swatchType: "pants" },
  { id: "denim", label: "Blue Denim", asset: null, swatchType: "pants" },
  { id: "slacks", label: "Shadow Slacks", asset: null, swatchType: "pants" },
  { id: "cargo", label: "Cargo Gold", asset: null, swatchType: "pants" },
  { id: "track", label: "Track Violet", asset: null, swatchType: "pants" },
  { id: "tech", label: "Tech Greaves", asset: null, swatchType: "pants" },
] as const satisfies readonly AssetOption[];

export const accessoryOptions = [
  { id: "none", label: "No Extra", asset: null, swatchType: "accessories" },
  { id: "crown", label: "Glow Crown", asset: null, swatchType: "accessories" },
  { id: "headset", label: "Beat Headset", asset: null, swatchType: "accessories" },
  { id: "cap", label: "Rookie Cap", asset: null, swatchType: "accessories" },
  { id: "visor", label: "Laser Visor", asset: null, swatchType: "accessories" },
  { id: "pack", label: "Jet Pack", asset: null, swatchType: "accessories" },
] as const satisfies readonly AssetOption[];

export const colorOptions = [
  {
    id: "original",
    label: "Original",
    className: "theme-original",
    fill: "#f2f2f2",
    stroke: "#b2b2b2",
    highlight: "#f8f8f8",
    swatchType: "color",
  },
  {
    id: "rose",
    label: "Rose Pop",
    className: "theme-rose",
    fill: "#ffbfdc",
    stroke: "#f45aa5",
    highlight: "#ffe7f3",
    swatchType: "color",
  },
  {
    id: "ocean",
    label: "Ocean",
    className: "theme-ocean",
    fill: "#8ad8ff",
    stroke: "#2c78df",
    highlight: "#dff5ff",
    swatchType: "color",
  },
  {
    id: "sunset",
    label: "Sunset",
    className: "theme-sunset",
    fill: "#ffc18b",
    stroke: "#f18b35",
    highlight: "#ffe7ca",
    swatchType: "color",
  },
  {
    id: "mint",
    label: "Mint",
    className: "theme-mint",
    fill: "#b5ffe0",
    stroke: "#3b9f7c",
    highlight: "#ecfff7",
    swatchType: "color",
  },
  {
    id: "violet",
    label: "Violet",
    className: "theme-violet",
    fill: "#d5c0ff",
    stroke: "#7853c5",
    highlight: "#f3e9ff",
    swatchType: "color",
  },
] as const satisfies readonly ColorOption[];

export const customizationOptions = {
  eyes: eyesOptions,
  mouth: mouthOptions,
  pose: poseOptions,
  shirt: shirtOptions,
  pants: pantsOptions,
  accessories: accessoryOptions,
  color: colorOptions,
} as const;

export const slopTypeOptions = [
  {
    key: "mage",
    label: "Mage Type",
    shortLabel: "Mage",
    description: "Harness the power of arcane magic.",
    accentClass: "is-mage",
    stats: { attack: 85, defense: 60, speed: 72, magic: 95 },
    pointsAvailable: 10,
    abilities: [
      { id: "vortex", label: "Vortex", level: 3 },
      { id: "flare", label: "Flare", level: 2 },
      { id: "sigil", label: "Sigil", level: 4 },
      { id: "star", label: "Nova", level: 1 },
    ],
  },
  {
    key: "speed",
    label: "Speed Type",
    shortLabel: "Speed",
    description: "Move like lightning. Strike with speed.",
    accentClass: "is-speed",
    stats: { attack: 74, defense: 58, speed: 92, magic: 64 },
    pointsAvailable: 7,
    abilities: [
      { id: "dash", label: "Dash", level: 4 },
      { id: "zap", label: "Spark", level: 3 },
      { id: "blink", label: "Blink", level: 2 },
      { id: "burst", label: "Burst", level: 5 },
    ],
  },
  {
    key: "tank",
    label: "Tank Type",
    shortLabel: "Tank",
    description: "Unstoppable defense. Lead the frontline.",
    accentClass: "is-tank",
    stats: { attack: 67, defense: 94, speed: 49, magic: 58 },
    pointsAvailable: 12,
    abilities: [
      { id: "guard", label: "Guard", level: 5 },
      { id: "slam", label: "Slam", level: 3 },
      { id: "taunt", label: "Taunt", level: 2 },
      { id: "wall", label: "Wall", level: 4 },
    ],
  },
] as const satisfies readonly {
  key: SlopTypeKey;
  label: string;
  shortLabel: string;
  description: string;
  accentClass: string;
  stats: Record<"attack" | "defense" | "speed" | "magic", number>;
  pointsAvailable: number;
  abilities: readonly { id: string; label: string; level: number }[];
}[];

export const expressionPresets = {
  angry: { eyes: 0, mouth: 0 },
  sad: { eyes: 1, mouth: 1 },
  whistle: { eyes: 1, mouth: 2 },
} as const;
