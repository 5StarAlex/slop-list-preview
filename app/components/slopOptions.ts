import eyesAngry from "../Character/eyes_angry.svg";
import eyesSadPlain from "../Character/eyes_sad_plain.svg";
import lashes from "../Character/lashes.svg";
import mouthAngry from "../Character/mouth_angry.svg";
import mouthSemiSad from "../Character/mouth_semi_sad.svg";
import mouthWhistle from "../Character/mouth_whistle.svg";

export const creatorCategories = [
  { key: "eyes", label: "Eyes" },
  { key: "pose", label: "Pose" },
  { key: "mouth", label: "Mouth" },
  { key: "color", label: "Color" },
  { key: "shirt", label: "Shirt" },
  { key: "accessories", label: "Accessories" },
  { key: "pants", label: "Pants" },
  { key: "stats", label: "Stats" },
] as const;

export type CreatorCategoryKey = (typeof creatorCategories)[number]["key"];
export type ConfigurableCategoryKey = Exclude<CreatorCategoryKey, "stats">;

type BaseOption = {
  id: string;
  label: string;
  swatchType: "eyes" | "mouth" | "shirt" | "pants" | "accessories" | "color" | "pose";
};

type AssetOption = BaseOption & {
  asset: typeof eyesSadPlain | typeof eyesAngry | typeof lashes | typeof mouthAngry | null;
  className?: never;
};

type ColorOption = BaseOption & {
  asset?: never;
  className: string;
  fill: string;
  stroke: string;
  highlight: string;
};

export type CustomizationOption = AssetOption | ColorOption;

export type CharacterConfig = Record<ConfigurableCategoryKey, number>;

export const defaultCharacterConfig: CharacterConfig = {
  eyes: 0,
  mouth: 0,
  pose: 0,
  shirt: 0,
  pants: 0,
  accessories: 0,
  color: 0,
};

export const eyesOptions = [
  { id: "sad", label: "Sad", asset: eyesSadPlain, swatchType: "eyes" },
  { id: "angry", label: "Angry", asset: eyesAngry, swatchType: "eyes" },
  { id: "lashed", label: "Lashed", asset: lashes, swatchType: "eyes" },
] as const satisfies readonly AssetOption[];

export const mouthOptions = [
  { id: "angry", label: "Angry", asset: mouthAngry, swatchType: "mouth" },
  { id: "semi-sad", label: "Semi Sad", asset: mouthSemiSad, swatchType: "mouth" },
  { id: "whistle", label: "Whistle", asset: mouthWhistle, swatchType: "mouth" },
] as const satisfies readonly AssetOption[];

export const poseOptions = [
  { id: "idle", label: "Idle Pose", asset: null, swatchType: "pose" },
] as const satisfies readonly AssetOption[];

export const shirtOptions = [
  { id: "none", label: "Base Fit", asset: null, swatchType: "shirt" },
] as const satisfies readonly AssetOption[];

export const pantsOptions = [
  { id: "none", label: "Base Pants", asset: null, swatchType: "pants" },
] as const satisfies readonly AssetOption[];

export const accessoryOptions = [
  { id: "none", label: "No Extra", asset: null, swatchType: "accessories" },
] as const satisfies readonly AssetOption[];

export const colorOptions = [
  {
    id: "original",
    label: "Original",
    className: "theme-original",
    fill: "#f2f2f2",
    stroke: "#b2b2b2",
    highlight: "#f2f2f2",
    swatchType: "color",
  },
  {
    id: "rose",
    label: "Rose Pop",
    className: "theme-rose",
    fill: "#ffb5cf",
    stroke: "#cc5f8d",
    highlight: "#ffd8e7",
    swatchType: "color",
  },
  {
    id: "ocean",
    label: "Ocean",
    className: "theme-ocean",
    fill: "#8ad8ff",
    stroke: "#2474a8",
    highlight: "#d4f2ff",
    swatchType: "color",
  },
  {
    id: "sunset",
    label: "Sunset",
    className: "theme-sunset",
    fill: "#ffc18b",
    stroke: "#d16a3d",
    highlight: "#ffe1bb",
    swatchType: "color",
  },
  {
    id: "mint",
    label: "Mint",
    className: "theme-mint",
    fill: "#b5ffe0",
    stroke: "#3b9f7c",
    highlight: "#e2fff4",
    swatchType: "color",
  },
  {
    id: "violet",
    label: "Violet",
    className: "theme-violet",
    fill: "#d5c0ff",
    stroke: "#7853c5",
    highlight: "#efe5ff",
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

export const expressionPresets = {
  angry: { eyes: 1, mouth: 0 },
  sad: { eyes: 0, mouth: 1 },
  whistle: { eyes: 0, mouth: 2 },
} as const;
