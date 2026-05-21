"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ComicShell from "../components/ComicShell";
import { useAccount } from "../components/AccountProvider";
import SlopCharacterPreview from "../components/character/SlopCharacterPreview";
import { customizationOptions, type CharacterConfig } from "../components/slopOptions";

type Anime = {
  mal_id: number;
  title: string;
  image: string;
  score?: number;
};

const WATCHLIST_KEY = "slop-list-watchlist";

const inventoryTabs = [
  { key: "shirt", label: "Inventory", icon: "\ud83d\udcbc" },
  { key: "pants", label: "Pants", icon: "\ud83d\udc56" },
  { key: "eyes", label: "Face", icon: "\ud83d\udc41" },
  { key: "mouth", label: "Mouth", icon: "\ud83d\udcac" },
  { key: "color", label: "Creation", icon: "\ud83d\uddbc" },
  { key: "accessories", label: "Stats", icon: "\ud83d\udcca" },
] as const;

type InventoryTabKey = (typeof inventoryTabs)[number]["key"];

export default function ProfilePage() {
  const { account, updateCharacterConfig } = useAccount();
  const [activeTab, setActiveTab] = useState<InventoryTabKey>("shirt");
  const [query, setQuery] = useState("");
  const [watchlist] = useState<Anime[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const raw = window.localStorage.getItem(WATCHLIST_KEY);
      return raw ? (JSON.parse(raw) as Anime[]) : [];
    } catch {
      window.localStorage.removeItem(WATCHLIST_KEY);
      return [];
    }
  });

  const activeOptions = customizationOptions[activeTab].filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const activeValue = account.characterConfig[activeTab];

  const updateConfig = (key: InventoryTabKey, value: number) => {
    updateCharacterConfig({
      ...account.characterConfig,
      [key]: value,
    } as CharacterConfig);
  };

  const statCards = useMemo(
    () => [
      ["Stars", account.economy.coins],
      ["Watchlist", watchlist.length],
      ["Level", account.progression.level],
      ["XP", `${account.progression.xp}/${account.progression.xpToNextLevel}`],
    ],
    [account.economy.coins, account.progression.level, account.progression.xp, account.progression.xpToNextLevel, watchlist.length],
  );

  return (
    <ComicShell className="comic-studio-page">
      <main className="comic-studio">
        <header className="comic-page-title">
          <Link href="/" className="comic-back-button" aria-label="Back home">{"\u2039"}</Link>
          <div>
            <h1>{account.profile.displayName}</h1>
            <p>@{account.profile.username}</p>
          </div>
          <div className="comic-window-controls">
            <span>{"\u2b50"} {account.economy.coins}</span>
          </div>
        </header>

        <section className="comic-studio-grid">
          <aside className="comic-avatar-builder">
            {(["eyes", "mouth", "color", "shirt", "pants", "accessories"] as const).map((slot) => {
              const option = customizationOptions[slot][account.characterConfig[slot]];

              return (
                <button
                  type="button"
                  key={slot}
                  className={`comic-slot is-${slot}`}
                  onClick={() => setActiveTab(slot)}
                >
                  <span>{slot.toUpperCase()}</span>
                  <strong>{option?.label ?? "..."}</strong>
                  <em>{"\u2605"}</em>
                </button>
              );
            })}
            <div className="comic-studio-character is-live-preview">
              <SlopCharacterPreview config={account.characterConfig} equippedShopItemIds={account.equippedShopItemIds} pedestal />
            </div>
          </aside>

          <section className="comic-inventory-panel">
            <header>
              <h2>Customize {activeTab}</h2>
              <strong>{activeOptions.length}/100</strong>
            </header>
            <input
              className="comic-inventory-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search clothes, face, colors..."
            />
            <div className="comic-item-grid">
              {activeOptions.map((item) => {
                const realIndex = customizationOptions[activeTab].findIndex((option) => option.id === item.id);
                const active = activeValue === realIndex;

                return (
                  <button
                    type="button"
                    className={`comic-item-card${active ? " is-selected" : ""}`}
                    key={item.id}
                    onClick={() => updateConfig(activeTab, realIndex)}
                  >
                    <span className={`comic-shirt-icon is-${item.swatchType}`} />
                    <strong>{item.label}</strong>
                    {active ? <em>{"\u2713"}</em> : null}
                  </button>
                );
              })}
            </div>
            <div className="comic-profile-stats">
              {statCards.map(([label, value]) => (
                <span key={label}><strong>{value}</strong>{label}</span>
              ))}
            </div>
            <div className="comic-profile-watchlist">
              <h2>Watch List</h2>
              {watchlist.length === 0 ? (
                <p>Add anime from Catalog and it will show up here.</p>
              ) : (
                <ul>
                  {watchlist.slice(0, 6).map((anime) => (
                    <li key={anime.mal_id}>{anime.title}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="comic-category-rail">
              <button type="button" className={activeTab === "shirt" ? "is-active" : ""} onClick={() => setActiveTab("shirt")}>{"\ud83d\udc55"}</button>
              <button type="button" className={activeTab === "pants" ? "is-active" : ""} onClick={() => setActiveTab("pants")}>{"\ud83d\udc56"}</button>
              <button type="button" className={activeTab === "eyes" ? "is-active" : ""} onClick={() => setActiveTab("eyes")}>{"\ud83d\udc41"}</button>
              <button type="button" className={activeTab === "mouth" ? "is-active" : ""} onClick={() => setActiveTab("mouth")}>{"\ud83d\udcac"}</button>
              <button type="button" className={activeTab === "color" ? "is-active" : ""} onClick={() => setActiveTab("color")}>{"\ud83c\udfa8"}</button>
              <button type="button" className={activeTab === "accessories" ? "is-active" : ""} onClick={() => setActiveTab("accessories")}>{"\u2655"}</button>
            </div>
          </section>
        </section>

        <nav className="comic-studio-tabs" aria-label="Studio tabs">
          {inventoryTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={activeTab === tab.key ? "is-active" : ""}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </main>
    </ComicShell>
  );
}
