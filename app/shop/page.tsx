"use client";

import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteNav from "../components/SiteNav";
import {
  COINS_EVENT_NAME,
  COINS_STORAGE_KEY,
  SHOP_EVENT_NAME,
  WHITE_TRAIL_COST,
  WHITE_TRAIL_STORAGE_KEY,
} from "../lib/siteData";

function readCoins() {
  if (typeof window === "undefined") {
    return 0;
  }

  const stored = Number(window.localStorage.getItem(COINS_STORAGE_KEY) ?? "0");
  return Number.isFinite(stored) ? stored : 0;
}

function readTrailUnlocked() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(WHITE_TRAIL_STORAGE_KEY) === "true";
}

export default function ShopPage() {
  const [coins, setCoins] = useState(() => readCoins());
  const [trailUnlocked, setTrailUnlocked] = useState(() => readTrailUnlocked());
  const [message, setMessage] = useState("Spend your coins on an upgrade that follows you across the whole site.");

  useEffect(() => {
    const syncCoins = (event: Event) => {
      const customEvent = event as CustomEvent<{ total?: number }>;
      setCoins(customEvent.detail?.total ?? readCoins());
    };

    const syncTrail = () => setTrailUnlocked(readTrailUnlocked());

    window.addEventListener(COINS_EVENT_NAME, syncCoins as EventListener);
    window.addEventListener(SHOP_EVENT_NAME, syncTrail as EventListener);

    return () => {
      window.removeEventListener(COINS_EVENT_NAME, syncCoins as EventListener);
      window.removeEventListener(SHOP_EVENT_NAME, syncTrail as EventListener);
    };
  }, []);

  const buyWhiteTrail = () => {
    if (trailUnlocked) {
      setMessage("White mouse trail already unlocked. It stays active across the whole site.");
      return;
    }

    if (coins < WHITE_TRAIL_COST) {
      setMessage(`You need ${WHITE_TRAIL_COST - coins} more slop coins to buy the white mouse trail.`);
      return;
    }

    const nextCoins = coins - WHITE_TRAIL_COST;
    window.localStorage.setItem(COINS_STORAGE_KEY, String(nextCoins));
    window.localStorage.setItem(WHITE_TRAIL_STORAGE_KEY, "true");
    window.dispatchEvent(new CustomEvent(COINS_EVENT_NAME, { detail: { amount: 0, total: nextCoins } }));
    window.dispatchEvent(new CustomEvent(SHOP_EVENT_NAME));
    setCoins(nextCoins);
    setTrailUnlocked(true);
    setMessage("White mouse trail unlocked. It now follows your cursor across the full website.");
  };

  return (
    <div className="route-page">
      <SiteHeader />
      <div className="route-shell">
        <SiteNav />
        <div className="route-page-head">
          <p className="route-page-subtitle">Slop Shop</p>
          <h1 className="route-page-title">Spend Your Slop Coins</h1>
          <p className="route-copy">
            The shop keeps the same site styling, but this one actually gives you a global unlock
            instead of a local gimmick.
          </p>
        </div>

        <div className="route-grid">
          <article className="route-card shop-card">
            <h3>White Mouse Trail</h3>
            <p>Cost: {WHITE_TRAIL_COST} slop coins</p>
            <div className="shop-preview" aria-hidden="true">
              <span className="shop-preview-pixel pixel-one" />
              <span className="shop-preview-pixel pixel-two" />
              <span className="shop-preview-pixel pixel-three" />
              <span className="shop-preview-cursor" />
            </div>
            <button type="button" className="post-button" onClick={buyWhiteTrail}>
              {trailUnlocked ? "Unlocked" : "Buy Upgrade"}
            </button>
          </article>

          <article className="route-card shop-card">
            <h3>Wallet + Status</h3>
            <p>Current coins: {coins}</p>
            <p>{trailUnlocked ? "Global white trail is active." : "Global white trail is still locked."}</p>
            <p className="route-copy">{message}</p>
          </article>
        </div>
      </div>
    </div>
  );
}
