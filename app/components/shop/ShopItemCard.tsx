"use client";

import { type ShopItem } from "../../lib/shopData";

type ShopItemCardProps = {
  item: ShopItem;
  isOwned: boolean;
  isEquipped: boolean;
  isPreviewing: boolean;
  onPreview: () => void;
  onBuy: () => void;
  canAfford: boolean;
};

export default function ShopItemCard({
  item,
  isOwned,
  isEquipped,
  isPreviewing,
  onPreview,
  onBuy,
  canAfford,
}: ShopItemCardProps) {
  return (
    <article className={`slop-shop-item-card is-${item.rarity}${isPreviewing ? " is-previewing" : ""}${isEquipped ? " is-equipped" : ""}`}>
      <div className="slop-shop-item-card__top">
        <div>
          <strong>{item.name}</strong>
          <span className="slop-shop-item-card__rarity">{item.rarity}</span>
        </div>
        {isEquipped ? <span className="slop-shop-item-card__flag">Equipped</span> : null}
      </div>

      <button type="button" className={`slop-shop-item-card__art is-${item.icon}`} onClick={onPreview} aria-label={`Preview ${item.name}`}>
        <span className="slop-shop-item-card__glow" aria-hidden="true" />
        <span className="slop-shop-item-card__spark is-one" aria-hidden="true" />
        <span className="slop-shop-item-card__spark is-two" aria-hidden="true" />
      </button>

      <div className="slop-shop-item-card__bottom">
        <span className="slop-shop-item-card__price">{"\u2605"} {item.price}</span>
        {isOwned ? (
          <button type="button" className="slop-shop-item-card__button is-owned" onClick={onPreview}>
            {isEquipped ? "Viewing" : "Try On"}
          </button>
        ) : (
          <button type="button" className="slop-shop-item-card__button" onClick={onBuy} disabled={!canAfford}>
            {canAfford ? "Buy" : "Need Coins"}
          </button>
        )}
      </div>
    </article>
  );
}
