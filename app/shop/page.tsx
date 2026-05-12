"use client";

import { useMemo, useState } from "react";
import SlopPageShell from "../components/layout/SlopPageShell";
import NeonPanel from "../components/ui/NeonPanel";
import ShopTryOnPreview from "../components/shop/ShopTryOnPreview";
import ShopItemCard from "../components/shop/ShopItemCard";
import { useAccount } from "../components/AccountProvider";
import { allShopItems, dailyDealItems, featuredShopItems, getShopItem } from "../lib/shopData";

export default function ShopPage() {
  const { account, spendCoins, unlockShopItems, setEquippedShopItems } = useAccount();
  const [selectedItemId, setSelectedItemId] = useState<string>(featuredShopItems[0].id);
  const [tryOnMode, setTryOnMode] = useState(true);
  const [message, setMessage] = useState("Featured items rotate daily. Try on a fit and lock it in when you're ready.");

  const ownedItemIds = account.ownedShopItemIds;
  const equippedItemIds = account.equippedShopItemIds;
  const selectedItem = getShopItem(selectedItemId);

  const previewItemIds = useMemo(() => {
    if (!tryOnMode || !selectedItem) {
      return equippedItemIds;
    }

    const next = new Set(equippedItemIds);

    if (selectedItem.category === "shirt") {
      for (const item of allShopItems) {
        if (item.category === "shirt") {
          next.delete(item.id);
        }
      }
    }

    if (selectedItem.category === "pants") {
      for (const item of allShopItems) {
        if (item.category === "pants") {
          next.delete(item.id);
        }
      }
    }

    if (
      selectedItem.category === "accessory" ||
      selectedItem.category === "eyes" ||
      selectedItem.category === "effect" ||
      selectedItem.category === "shoes" ||
      selectedItem.category === "pet"
    ) {
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
      setMessage(`${item.name} is already in your inventory.`);
      return;
    }

    if (!spendCoins(item.price)) {
      setMessage(`You need ${item.price - account.economy.coins} more coins for ${item.name}.`);
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
      setMessage(`You need ${previewCost - account.economy.coins} more coins to buy this full loadout.`);
      return;
    }

    unlockShopItems(pending);
    setEquippedShopItems(previewItemIds);
    setMessage("Bought and equipped your full try-on loadout.");
  };

  return (
    <SlopPageShell className="slop-shop-route">
      <div className="slop-page-heading slop-page-heading--shop">
        <div>
          <p className="slop-page-kicker">Arcade Mall</p>
          <h1 className="slop-page-title">Slop Shop</h1>
        </div>
        <p className="slop-page-copy">{message}</p>
      </div>

      <div className="slop-shop-layout">
        <NeonPanel variant="dark" className="slop-shop-left">
          <ShopTryOnPreview
            config={account.characterConfig}
            previewItemIds={previewItemIds}
            tryOnMode={tryOnMode}
            onToggleTryOn={() => setTryOnMode((current) => !current)}
            onReset={() => {
              setSelectedItemId(featuredShopItems[0].id);
              setTryOnMode(false);
            }}
            onBuyEquipped={buyEquipped}
          />
        </NeonPanel>

        <NeonPanel variant="purple" className="slop-shop-right">
          <div className="slop-shop-section-head">
            <div>
              <p className="slop-shop-kicker">Featured Items</p>
              <h2 className="slop-shop-title">Build Your Fit</h2>
            </div>
            <span className="slop-shop-total">Preview Cost: {"\u2605"} {previewCost}</span>
          </div>

          <div className="slop-shop-grid">
            {featuredShopItems.map((item) => (
              <ShopItemCard
                key={item.id}
                item={item}
                isOwned={ownedItemIds.includes(item.id)}
                isEquipped={equippedItemIds.includes(item.id)}
                isPreviewing={selectedItemId === item.id}
                onPreview={() => setSelectedItemId(item.id)}
                onBuy={() => buyItem(item.id)}
                canAfford={account.economy.coins >= item.price}
              />
            ))}
          </div>
        </NeonPanel>
      </div>

      <NeonPanel variant="pink" className="slop-daily-deals">
        <div className="slop-shop-section-head">
          <div>
            <p className="slop-shop-kicker">Daily Deals</p>
            <h2 className="slop-shop-title">Fresh Rotation</h2>
          </div>
          <span className="slop-shop-total">New deals in: 12:45:30</span>
        </div>

        <div className="slop-daily-deals-row">
          {dailyDealItems.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              isOwned={ownedItemIds.includes(item.id)}
              isEquipped={equippedItemIds.includes(item.id)}
              isPreviewing={selectedItemId === item.id}
              onPreview={() => setSelectedItemId(item.id)}
              onBuy={() => buyItem(item.id)}
              canAfford={account.economy.coins >= item.price}
            />
          ))}
        </div>
      </NeonPanel>
    </SlopPageShell>
  );
}
