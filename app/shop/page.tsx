"use client";

import { useState } from "react";
import { useAccount } from "../components/AccountProvider";
import SiteHeader from "../components/SiteHeader";
import { WHITE_TRAIL_COST } from "../lib/siteData";

export default function ShopPage() {
  const { account, spendCoins, setWhiteTrailEnabled } = useAccount();
  const [message, setMessage] = useState("Spend your coins on an upgrade that follows you across the whole site.");
  const coins = account.economy.coins;
  const trailUnlocked = account.unlocks.whiteTrailEnabled;

  const buyWhiteTrail = () => {
    if (trailUnlocked) {
      setMessage("White mouse trail already unlocked. It stays active across the whole site.");
      return;
    }

    if (coins < WHITE_TRAIL_COST) {
      setMessage(`You need ${WHITE_TRAIL_COST - coins} more slop coins to buy the white mouse trail.`);
      return;
    }

    if (!spendCoins(WHITE_TRAIL_COST)) {
      setMessage("That purchase could not be completed.");
      return;
    }

    setWhiteTrailEnabled(true);
    setMessage("White mouse trail unlocked. It now follows your cursor across the full website.");
  };

  return (
    <div className="route-page">
      <SiteHeader />
      <div className="route-shell">
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
