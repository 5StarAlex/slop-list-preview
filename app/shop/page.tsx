"use client";

import { useMemo, useState } from "react";
import ComicShell from "../components/ComicShell";
import SlopCharacterPreview from "../components/character/SlopCharacterPreview";
import { useAccount } from "../components/AccountProvider";
import { allShopItems, dailyDealItems, featuredShopItems, getShopItem, type ShopItem } from "../lib/shopData";

export default function ShopPage() {
  const { account, spendCoins, unlockShopItems, setEquippedShopItems } = useAccount();
  const [selectedItemId, setSelectedItemId] = useState<string>(featuredShopItems[0].id);
  const [tryOnMode, setTryOnMode] = useState(true);
  const [message, setMessage] = useState("Try on a fit, grab deals, and keep your slop looking ranked.");

  const ownedItemIds = account.ownedShopItemIds;
  const equippedItemIds = account.equippedShopItemIds;
  const selectedItem = getShopItem(selectedItemId);

  const previewItemIds = useMemo(() => {
    if (!tryOnMode || !selectedItem) {
      return equippedItemIds;
    }

    const next = new Set(equippedItemIds);

    if (selectedItem.category === "shirt" || selectedItem.category === "pants") {
      for (const item of allShopItems) {
        if (item.category === selectedItem.category) {
          next.delete(item.id);
        }
      }
    }

    if (["accessory", "eyes", "effect", "shoes", "pet", "backdrop"].includes(selectedItem.category)) {
      next.delete(selectedItem.id);
    }

    next.add(selectedItem.id);
    return Array.from(next);
  }, [equippedItemIds, selectedItem, tryOnMode]);

  const previewCost = previewItemIds.reduce((total, itemId) => {
    if (ownedItemIds.includes(itemId)) {
      return total;
    }

    return total + (getShopItem(itemId)?.price ?? 0);
  }, 0);

  const buyItem = (itemId: string) => {
    const item = getShopItem(itemId);
    if (!item) {
      return;
    }

    if (ownedItemIds.includes(item.id)) {
      setMessage(`${item.name} is already in your locker.`);
      return;
    }

    if (!spendCoins(item.price)) {
      setMessage(`You need ${item.price - account.economy.coins} more stars for ${item.name}.`);
      return;
    }

    unlockShopItems([item.id]);
    setMessage(`${item.name} added to your locker.`);
  };

  const buyEquipped = () => {
    const pending = previewItemIds.filter((itemId) => !ownedItemIds.includes(itemId));

    if (pending.length === 0) {
      setEquippedShopItems(previewItemIds);
      setMessage("Equipped your current fit.");
      return;
    }

    if (!spendCoins(previewCost)) {
      setMessage(`You need ${previewCost - account.economy.coins} more stars to buy this full loadout.`);
      return;
    }

    unlockShopItems(pending);
    setEquippedShopItems(previewItemIds);
    setMessage("Bought and equipped your full try-on loadout.");
  };

  return (
    <ComicShell className="comic-shop-page">
      <main className="comic-shop">
        <section className="comic-shop-title">
          <div>
            <p>SLOP SHOP</p>
            <h1>LOCKER DROP</h1>
          </div>
          <span>{"\u2605"} {account.economy.coins}</span>
        </section>

        <section className="comic-shop-grid">
          <aside className="comic-shop-preview">
            <div className="comic-shop-preview-head">
              <h2>TRY ON</h2>
              <button type="button" className={tryOnMode ? "is-active" : ""} onClick={() => setTryOnMode((current) => !current)}>
                Preview {tryOnMode ? "On" : "Off"}
              </button>
            </div>
            <div className="comic-shop-stage">
              <SlopCharacterPreview config={account.characterConfig} equippedShopItemIds={previewItemIds} />
            </div>
            <p>{message}</p>
            <div className="comic-shop-actions">
              <button type="button" onClick={() => setSelectedItemId(featuredShopItems[0].id)}>Reset</button>
              <button type="button" className="is-buy" onClick={buyEquipped}>Buy Fit {"\u2605"} {previewCost}</button>
            </div>
          </aside>

          <section className="comic-shop-items">
            <ComicShopHeader kicker="FEATURED ITEMS" title="BUILD YOUR FIT" value={`Preview Cost: \u2605 ${previewCost}`} />
            <div className="comic-shop-card-grid">
              {featuredShopItems.map((item) => (
                <ComicShopItem
                  key={item.id}
                  item={item}
                  active={selectedItemId === item.id}
                  owned={ownedItemIds.includes(item.id)}
                  equipped={equippedItemIds.includes(item.id)}
                  canAfford={account.economy.coins >= item.price}
                  onPreview={() => setSelectedItemId(item.id)}
                  onBuy={() => buyItem(item.id)}
                />
              ))}
            </div>
          </section>
        </section>

        <section className="comic-shop-deals">
          <ComicShopHeader kicker="DAILY DEALS" title="FRESH ROTATION" value="New deals in 12:45:30" />
          <div className="comic-shop-deal-row">
            {dailyDealItems.map((item) => (
              <ComicShopItem
                key={item.id}
                item={item}
                active={selectedItemId === item.id}
                owned={ownedItemIds.includes(item.id)}
                equipped={equippedItemIds.includes(item.id)}
                canAfford={account.economy.coins >= item.price}
                onPreview={() => setSelectedItemId(item.id)}
                onBuy={() => buyItem(item.id)}
              />
            ))}
          </div>
        </section>
      </main>
    </ComicShell>
  );
}

function ComicShopHeader({ kicker, title, value }: { kicker: string; title: string; value: string }) {
  return (
    <header className="comic-shop-section-head">
      <div>
        <p>{kicker}</p>
        <h2>{title}</h2>
      </div>
      <span>{value}</span>
    </header>
  );
}

function ComicShopItem({
  item,
  active,
  owned,
  equipped,
  canAfford,
  onPreview,
  onBuy,
}: {
  item: ShopItem;
  active: boolean;
  owned: boolean;
  equipped: boolean;
  canAfford: boolean;
  onPreview: () => void;
  onBuy: () => void;
}) {
  return (
    <article className={`comic-shop-item is-${item.rarity}${active ? " is-active" : ""}`}>
      <button type="button" className="comic-shop-item-preview" onClick={onPreview} aria-label={`Preview ${item.name}`}>
        <span className={`comic-shop-item-icon is-${item.icon}`} aria-hidden="true" />
        {equipped ? <em>Equipped</em> : null}
      </button>
      <h3>{item.name}</h3>
      <p>{item.category}</p>
      <div>
        <strong>{"\u2605"} {item.price}</strong>
        <button type="button" onClick={onBuy} disabled={owned || !canAfford}>
          {owned ? "Owned" : "Buy"}
        </button>
      </div>
    </article>
  );
}
