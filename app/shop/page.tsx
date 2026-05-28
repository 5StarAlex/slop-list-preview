"use client";

import Image from "next/image";
import { type CSSProperties, useMemo, useState } from "react";
import ComicShell from "../components/ComicShell";
import { useAccount } from "../components/AccountProvider";
import { SlopArmSvg, SlopBodySvg, SlopHeadSvg, SlopLegSvg } from "../components/SlopBodyParts";
import { customizationOptions, type CharacterConfig } from "../components/slopOptions";
import { allShopItems, featuredShopItems, getShopItem, type ShopCategory, type ShopItem } from "../lib/shopData";

type ShopFilter = "all" | "shirt" | "pants" | "accessory" | "eyes" | "backdrop" | "shoes";

const shopTabs: Array<{ key: ShopFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "shirt", label: "Shirts" },
  { key: "pants", label: "Pants" },
  { key: "accessory", label: "Crowns" },
  { key: "eyes", label: "Eyes" },
  { key: "backdrop", label: "Backdrops" },
  { key: "shoes", label: "Shoes" },
];

const railItems = ["head", "shirt", "pants", "crown", "eyes", "backdrop", "shoes"] as const;

const replacementCategories: ShopCategory[] = ["shirt", "pants", "eyes", "backdrop", "shoes"];

const starterFitIds = [
  "neon-drip-hoodie",
  "galaxy-pajama-pants",
  "slop-king-crown",
  "sleepy-slop-eyes",
  "neon-backdrop",
  "star-slippers",
];

function categoryLabel(category: ShopCategory) {
  if (category === "accessory") return "Crown";
  if (category === "backdrop") return "Backdrop";
  return category;
}

function itemTone(item: ShopItem) {
  if (item.category === "shirt" || item.category === "shoes") return "green";
  if (item.category === "pants") return "blue";
  if (item.category === "backdrop") return "violet";
  return "purple";
}

function normalizePreviewItems(current: string[], item: ShopItem) {
  const next = new Set(current);

  if (replacementCategories.includes(item.category)) {
    for (const shopItem of allShopItems) {
      if (shopItem.category === item.category) {
        next.delete(shopItem.id);
      }
    }
  }

  if (item.category === "accessory") {
    for (const shopItem of allShopItems) {
      if (shopItem.category === "accessory" && ["crown", "halo", "cap"].includes(shopItem.icon)) {
        next.delete(shopItem.id);
      }
    }
  }

  next.add(item.id);
  return Array.from(next);
}

function ShopItemArt({ item }: { item: ShopItem }) {
  return <span className={`slop-shop-studio-art is-${item.icon}`} aria-hidden="true" />;
}

function ShopTryOnCharacter({ config }: { config: CharacterConfig }) {
  const selectedEyes = customizationOptions.eyes[config.eyes];
  const selectedMouth = customizationOptions.mouth[config.mouth];
  const style = {
    "--studio-head-fill": "#f4f4f4",
    "--studio-body-fill": "#ffffff",
    "--studio-arms-fill": "#ffffff",
    "--studio-legs-fill": "#ffffff",
    "--studio-outline": "#3f3f3f",
    "--studio-face": "#11131a",
    "--studio-glow": "#d765f4",
  } as CSSProperties;

  return (
    <div className="slop-studio-character-shell slop-shop-plain-character" style={style}>
      <div className="slop-studio-character" aria-label="Slop shop try-on character preview">
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
        <div className="slop-studio-part slop-studio-arm is-right">
          <SlopArmSvg variant="left" className="slop-studio-svg" />
        </div>
        <div className="slop-studio-part slop-studio-head">
          <SlopHeadSvg className="slop-studio-svg" />
        </div>
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

export default function ShopPage() {
  const { account, spendCoins, unlockShopItems, setEquippedShopItems } = useAccount();
  const [activeTab, setActiveTab] = useState<ShopFilter>("all");
  const [previewOn, setPreviewOn] = useState(true);
  const [previewItemIds, setPreviewItemIds] = useState<string[]>(account.equippedShopItemIds.length ? account.equippedShopItemIds : starterFitIds);
  const [cartIds, setCartIds] = useState<string[]>([featuredShopItems[0].id]);
  const [selectedItemId, setSelectedItemId] = useState(featuredShopItems[0].id);
  const [message, setMessage] = useState("Mix, match, and make it yours.");

  const ownedItemIds = account.ownedShopItemIds;
  const selectedItem = getShopItem(selectedItemId) ?? featuredShopItems[0];
  const cartItems = cartIds.map((itemId) => getShopItem(itemId)).filter((item): item is ShopItem => Boolean(item));
  const previewItems = previewItemIds.map((itemId) => getShopItem(itemId)).filter((item): item is ShopItem => Boolean(item));
  const visibleItems = useMemo(
    () => allShopItems.filter((item) => activeTab === "all" || item.category === activeTab),
    [activeTab],
  );

  const fitCost = previewItemIds.reduce((total, itemId) => {
    if (ownedItemIds.includes(itemId) || cartIds.includes(itemId)) return total;
    return total + (getShopItem(itemId)?.price ?? 0);
  }, 0);

  const cartTotal = cartItems.reduce((total, item) => total + (ownedItemIds.includes(item.id) ? 0 : item.price), 0);

  const previewItem = (item: ShopItem) => {
    setSelectedItemId(item.id);
    setPreviewItemIds((current) => normalizePreviewItems(current, item));
    setMessage(`${item.name} is previewing on your slop.`);
  };

  const addToCart = (item: ShopItem) => {
    if (ownedItemIds.includes(item.id)) {
      setPreviewItem(item);
      return;
    }

    setCartIds((current) => (current.includes(item.id) ? current : [...current, item.id]));
    setMessage(`${item.name} added to your cart.`);
  };

  const addFitToCart = () => {
    const pending = previewItemIds.filter((itemId) => !ownedItemIds.includes(itemId));
    setCartIds((current) => Array.from(new Set([...current, ...pending])));
    setMessage(pending.length ? "Preview fit added to your cart." : "Everything in this fit is already owned.");
  };

  const checkout = () => {
    const pending = cartIds.filter((itemId) => !ownedItemIds.includes(itemId));
    const total = pending.reduce((sum, itemId) => sum + (getShopItem(itemId)?.price ?? 0), 0);

    if (pending.length === 0) {
      setEquippedShopItems(previewItemIds);
      setMessage("Equipped your current fit.");
      return;
    }

    if (!spendCoins(total)) {
      setMessage(`You need ${total - account.economy.coins} more stars to check out.`);
      return;
    }

    unlockShopItems(pending);
    setEquippedShopItems(previewItemIds);
    setCartIds([]);
    setMessage("Checkout complete. Fit equipped.");
  };

  const resetPreview = () => {
    setPreviewItemIds(account.equippedShopItemIds);
    setCartIds([]);
    setSelectedItemId(featuredShopItems[0].id);
    setMessage("Try-on reset.");
  };

  const setPreviewItem = (item: ShopItem) => {
    previewItem(item);
    setMessage(`${item.name} is already in your locker.`);
  };

  return (
    <ComicShell className="slop-shop-studio-page">
      <main className="slop-shop-studio">
        <aside className="slop-shop-try-panel">
          <header>
            <h1>Try On</h1>
            <button type="button" className={previewOn ? "is-active" : ""} onClick={() => setPreviewOn((current) => !current)}>
              Preview {previewOn ? "On" : "Off"}
            </button>
          </header>

          <section className="slop-shop-stage">
            <nav aria-label="Try-on categories">
              {railItems.map((item) => (
                <button key={item} type="button" className={item === categoryLabel(selectedItem.category).toLowerCase() ? "is-active" : ""}>
                  <span className={`slop-shop-rail-icon is-${item}`} aria-hidden="true" />
                </button>
              ))}
            </nav>
            <ShopTryOnCharacter config={account.characterConfig} />
            <button type="button" className="slop-shop-shuffle" onClick={resetPreview} aria-label="Reset preview">
              ⤨
            </button>
          </section>

          <p>{message}</p>

          <footer>
            <button type="button" onClick={resetPreview}>Reset</button>
            <button type="button" onClick={addFitToCart}>Add to Cart <span>★ {fitCost}</span></button>
            <i aria-label={`${cartIds.length} items in cart`}>{cartIds.length}</i>
          </footer>
        </aside>

        <section className="slop-shop-build-panel">
          <header className="slop-shop-build-head">
            <div>
              <p>Featured Items</p>
              <h2>Build Your Fit</h2>
              <span aria-hidden="true" />
            </div>
            <div className="slop-shop-mascot" aria-hidden="true"><span /></div>
            <button type="button" onClick={checkout}>
              Preview Cost: <span>★ {cartTotal || fitCost}</span>
              <strong aria-hidden="true">▱</strong>
              {cartIds.length ? <em>{cartIds.length}</em> : null}
            </button>
          </header>

          <nav className="slop-shop-tabs" aria-label="Shop categories">
            {shopTabs.map((tab) => (
              <button key={tab.key} type="button" className={activeTab === tab.key ? "is-active" : ""} onClick={() => setActiveTab(tab.key)}>
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="slop-shop-item-grid">
            {visibleItems.slice(0, 8).map((item) => {
              const owned = ownedItemIds.includes(item.id);
              const inCart = cartIds.includes(item.id);
              const previewing = previewItemIds.includes(item.id);

              return (
                <article key={item.id} className={`slop-shop-product-card is-${itemTone(item)} ${selectedItemId === item.id ? "is-selected" : ""}`}>
                  <button type="button" className="slop-shop-product-art" onClick={() => previewItem(item)} aria-label={`Preview ${item.name}`}>
                    <ShopItemArt item={item} />
                  </button>
                  <h3>{item.name}</h3>
                  <p>{categoryLabel(item.category)}</p>
                  <footer>
                    <strong>☆ {item.price}</strong>
                    <button type="button" onClick={() => addToCart(item)} disabled={owned && previewing}>
                      {owned ? "Owned" : inCart ? "Added" : "Buy"}
                    </button>
                  </footer>
                </article>
              );
            })}
          </div>

          <footer className="slop-shop-fit-bar">
            <div>
              <strong>Your Fit</strong>
              <span>{previewItems.length} items</span>
            </div>
            <div className="slop-shop-fit-slots">
              {previewItems.slice(0, 6).map((item) => (
                <button key={item.id} type="button" onClick={() => previewItem(item)} aria-label={`Preview ${item.name}`}>
                  <ShopItemArt item={item} />
                </button>
              ))}
            </div>
            <p>Total: <strong>★ {cartTotal || fitCost}</strong></p>
            <button type="button" onClick={checkout}>
              Add to Cart <span aria-hidden="true">▱</span>
              {cartIds.length ? <em>{cartIds.length}</em> : null}
            </button>
          </footer>
        </section>
      </main>
    </ComicShell>
  );
}
