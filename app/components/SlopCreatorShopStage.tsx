"use client";

import Image from "next/image";
import { useMemo } from "react";
import {
  customizationOptions,
  type ConfigurableCategoryKey,
  type CustomizationOption,
} from "./slopOptions";
import SlopTitle from "./SlopTitle";

export type ShopTabKey = "home" | "eyes" | "mouth" | "color" | "shirt" | "accessories";
type ShopRarity = "common" | "rare" | "epic";
type ShopCurrency = "coins" | "crowns";

type ShopItem = {
  id: string;
  title: string;
  categoryKey: Exclude<ShopTabKey, "home">;
  option: CustomizationOption;
  rarity: ShopRarity;
  price: number;
  currency: ShopCurrency;
  owned?: boolean;
};

type ShopTab = {
  key: ShopTabKey;
  label: string;
  icon: string;
};

const shopTabs: readonly ShopTab[] = [
  { key: "home", label: "Home", icon: "home" },
  { key: "eyes", label: "Eyes", icon: "eyes" },
  { key: "mouth", label: "Mouth", icon: "mouth" },
  { key: "color", label: "Color", icon: "color" },
  { key: "shirt", label: "Shirt", icon: "shirt" },
  { key: "accessories", label: "Accessories", icon: "accessories" },
] as const;

const tabCategories = shopTabs
  .filter((tab): tab is ShopTab & { key: Exclude<ShopTabKey, "home"> } => tab.key !== "home")
  .map((tab) => tab.key);

const rarityLabels: Record<ShopRarity, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
};

function buildShopItems(categoryKey: Exclude<ShopTabKey, "home">): ShopItem[] {
  const options = customizationOptions[categoryKey as ConfigurableCategoryKey];

  return options.map((option, index) => {
    const rarity: ShopRarity =
      index === options.length - 1 && options.length > 2 ? "epic" : index > 0 ? "rare" : "common";
    const price = option.id === "none" ? 0 : categoryKey === "color" ? 1400 + index * 550 : 1800 + index * 750;
    const currency: ShopCurrency = rarity === "epic" ? "crowns" : "coins";
    const title =
      categoryKey === "color" ? `${option.label} Theme` : `${option.label} ${categoryKey.slice(0, 1).toUpperCase()}${categoryKey.slice(1)}`;

    return {
      id: `${categoryKey}-${option.id}`,
      title,
      categoryKey,
      option,
      rarity,
      price: currency === "crowns" ? Math.max(1, index + 1) : price,
      currency,
      owned: option.id === "none",
    };
  });
}

function renderPreview(item: ShopItem) {
  if ("asset" in item.option && item.option.asset) {
    return (
      <div className="slop-creator-shop-card-art">
        <Image src={item.option.asset} alt="" fill unoptimized className="slop-creator-shop-card-art-image" />
      </div>
    );
  }

  if ("className" in item.option) {
    return (
      <div className="slop-creator-shop-card-art is-color">
        <span
          className={`slop-creator-shop-card-swatch slop-creator-option-swatch-color ${item.option.className}`}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className={`slop-creator-shop-card-art is-placeholder is-${item.categoryKey}`}>
      <span className="slop-creator-shop-card-placeholder-shape" aria-hidden="true" />
    </div>
  );
}

function ShopCard({ item, featured = false }: { item: ShopItem; featured?: boolean }) {
  return (
    <article className={`slop-creator-shop-card rarity-${item.rarity}${featured ? " is-featured" : ""}`}>
      <div className="slop-creator-shop-card-rarity">{rarityLabels[item.rarity]}</div>
      <div className="slop-creator-shop-card-title">{item.title}</div>
      <div className="slop-creator-shop-card-preview">
        <span className="slop-creator-shop-card-watermark" aria-hidden="true">
          ?
        </span>
        {renderPreview(item)}
      </div>
      <div className="slop-creator-shop-card-price-row">
        {item.owned ? (
          <span className="slop-creator-shop-price-pill is-owned">Owned</span>
        ) : (
          <span className={`slop-creator-shop-price-pill is-${item.currency}`}>
            <span className="slop-creator-shop-price-icon" aria-hidden="true" />
            {item.price}
          </span>
        )}
      </div>
    </article>
  );
}

export default function SlopCreatorShopStage({
  activeTab,
  onTabChange,
}: {
  activeTab: ShopTabKey;
  onTabChange: (tab: ShopTabKey) => void;
}) {
  const categoryItems = useMemo(
    () =>
      Object.fromEntries(tabCategories.map((categoryKey) => [categoryKey, buildShopItems(categoryKey)])) as Record<
        Exclude<ShopTabKey, "home">,
        ShopItem[]
      >,
    [],
  );

  const featuredItems = useMemo(
    () => [categoryItems.eyes[1], categoryItems.mouth[2], categoryItems.color[5]].filter(Boolean),
    [categoryItems],
  );

  const homeRegularItems = useMemo(
    () =>
      [
        categoryItems.eyes[0],
        categoryItems.mouth[0],
        categoryItems.color[0],
        categoryItems.color[1],
        categoryItems.shirt[0],
        categoryItems.accessories[0],
      ].filter(Boolean),
    [categoryItems],
  );

  const tabItems = activeTab === "home" ? homeRegularItems : categoryItems[activeTab];

  return (
    <section className="slop-creator-shop" aria-label="Creator shop stage">
      <header className="slop-creator-shop-header">
        <SlopTitle as="h2" size="md" className="slop-creator-shop-title">Shop</SlopTitle>
        <div className="slop-creator-shop-tabs" role="tablist" aria-label="Shop categories">
          {shopTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              className={`slop-creator-shop-tab${activeTab === tab.key ? " is-active" : ""}`}
              aria-selected={activeTab === tab.key}
              onClick={() => onTabChange(tab.key)}
            >
              <span className={`slop-creator-shop-tab-icon is-${tab.icon}`} aria-hidden="true" />
              <span className="slop-creator-shop-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {activeTab === "home" ? (
        <>
          <section className="slop-creator-shop-section">
            <div className="slop-creator-shop-section-head">
              <SlopTitle as="h3" size="sm" className="slop-creator-shop-section-title">Featured Items</SlopTitle>
              <span className="slop-creator-shop-timer">02d 18h</span>
            </div>
            <div className="slop-creator-shop-featured-grid">
              {featuredItems.map((item) => (
                <ShopCard key={item.id} item={item} featured />
              ))}
            </div>
          </section>

          <section className="slop-creator-shop-section">
            <div className="slop-creator-shop-section-head">
              <SlopTitle as="h3" size="sm" className="slop-creator-shop-section-title">Regular Items</SlopTitle>
              <span className="slop-creator-shop-timer">18h 25m</span>
            </div>
            <div className="slop-creator-shop-regular-grid">
              {homeRegularItems.map((item) => (
                <ShopCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="slop-creator-shop-section is-category-only">
          <div className="slop-creator-shop-section-head">
            <SlopTitle as="h3" size="sm" className="slop-creator-shop-section-title">
              {`${shopTabs.find((tab) => tab.key === activeTab)?.label} Items`}
            </SlopTitle>
            <span className="slop-creator-shop-timer">Fresh Drop</span>
          </div>
          <div className="slop-creator-shop-regular-grid">
            {tabItems.map((item) => (
              <ShopCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
