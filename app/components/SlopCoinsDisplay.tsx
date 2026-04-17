"use client";

import { useEffect, useState } from "react";
import { COINS_EVENT_NAME } from "../lib/siteData";
import { useAccount } from "./AccountProvider";

type CoinPopup = {
  amount: number;
};

export default function SlopCoinsDisplay() {
  const { account } = useAccount();
  const [popups, setPopups] = useState<CoinPopup[]>([]);

  useEffect(() => {
    const onAward = (event: Event) => {
      const customEvent = event as CustomEvent<{ amount?: number; total?: number }>;
      const amount = customEvent.detail?.amount ?? 0;

      if (amount > 0) {
        setPopups([{ amount }]);
        window.setTimeout(() => {
          setPopups([]);
        }, 2000);
      }
    };

    window.addEventListener(COINS_EVENT_NAME, onAward as EventListener);
    return () => window.removeEventListener(COINS_EVENT_NAME, onAward as EventListener);
  }, []);

  return (
    <div className="coin-stack">
      <div className="coin-popup-anchor" aria-hidden="true">
        {popups.map((popup, index) => (
          <span key={`${popup.amount}-${index}`} className="coin-popup">
            +{popup.amount}
          </span>
        ))}
      </div>
      <div className="count-chip">
        {account.economy.coins} {"\u{1FA99}"}
      </div>
    </div>
  );
}
