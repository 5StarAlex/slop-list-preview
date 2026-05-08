export type ShopCategory =
  | "shirt"
  | "pants"
  | "accessory"
  | "eyes"
  | "pet"
  | "effect"
  | "backdrop"
  | "shoes";

export type ShopRarity = "common" | "rare" | "epic" | "legendary";

export type ShopItem = {
  id: string;
  name: string;
  category: ShopCategory;
  rarity: ShopRarity;
  price: number;
  previewType: "equip" | "effect" | "background";
  icon: string;
  badge?: string;
};

export const featuredShopItems: readonly ShopItem[] = [
  { id: "neon-drip-hoodie", name: "Neon Drip Hoodie", category: "shirt", rarity: "epic", price: 150, previewType: "equip", icon: "hoodie" },
  { id: "galaxy-pajama-pants", name: "Galaxy Pajama Pants", category: "pants", rarity: "rare", price: 120, previewType: "equip", icon: "pants" },
  { id: "slop-king-crown", name: "Slop King Crown", category: "accessory", rarity: "legendary", price: 250, previewType: "equip", icon: "crown" },
  { id: "sleepy-slop-eyes", name: "Sleepy Slop Eyes", category: "eyes", rarity: "epic", price: 80, previewType: "equip", icon: "eyes" },
  { id: "pixel-slop-pet", name: "Pixel Slop Pet", category: "pet", rarity: "rare", price: 100, previewType: "equip", icon: "pet" },
  { id: "bubble-tea-drink", name: "Bubble Tea Drink", category: "accessory", rarity: "common", price: 60, previewType: "equip", icon: "drink" },
  { id: "neon-backdrop", name: "Neon Backdrop", category: "backdrop", rarity: "epic", price: 180, previewType: "background", icon: "backdrop" },
  { id: "star-slippers", name: "Star Slippers", category: "shoes", rarity: "rare", price: 90, previewType: "equip", icon: "slippers" },
  { id: "white-mouse-trail", name: "White Mouse Trail", category: "effect", rarity: "legendary", price: 500, previewType: "effect", icon: "trail" },
] as const;

export const dailyDealItems: readonly ShopItem[] = [
  { id: "smirk-eyes", name: "Smirk Eyes", category: "eyes", rarity: "common", price: 50, previewType: "equip", icon: "eyes" },
  { id: "comfy-hoodie", name: "Comfy Hoodie", category: "shirt", rarity: "rare", price: 80, previewType: "equip", icon: "hoodie" },
  { id: "halo", name: "Halo", category: "accessory", rarity: "epic", price: 120, previewType: "equip", icon: "halo" },
  { id: "neon-cap", name: "Neon Cap", category: "accessory", rarity: "rare", price: 90, previewType: "equip", icon: "cap" },
  { id: "chill-shades", name: "Chill Vibes", category: "accessory", rarity: "common", price: 40, previewType: "equip", icon: "shades" },
] as const;

export const allShopItems = [...featuredShopItems, ...dailyDealItems] as const;

export function getShopItem(itemId: string) {
  return allShopItems.find((item) => item.id === itemId) ?? null;
}
