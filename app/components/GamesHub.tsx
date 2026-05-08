"use client";

import { useState } from "react";
import { useAccount } from "./AccountProvider";

const gameCards = [
  {
    key: "tag",
    label: "Tag Game",
    kicker: "Arcade Rush",
    description: "Two blocky slops sprint through neon lanes, juking corners and trading chase pressure.",
    accentClass: "is-tag",
    badge: "2P",
    cta: "Play Tag",
  },
  {
    key: "runner",
    label: "Endless Runner",
    kicker: "Neon Sprint",
    description: "A chunky slop charges through traps while a rival shadow racer pushes every jump and dodge.",
    accentClass: "is-runner",
    badge: "RUN",
    cta: "Start Run",
  },
  {
    key: "clash",
    label: "Clash Game",
    kicker: "Arena Clash",
    description: "Two blocky slops collide with bursts, shields, and arcade timing in a stylized duel arena.",
    accentClass: "is-clash",
    badge: "VS",
    cta: "Enter Clash",
  },
] as const;

type GameKey = (typeof gameCards)[number]["key"];

function WindowAction({ label }: { label: string }) {
  return (
    <button type="button" className="slop-create-window-button" aria-label={label}>
      <span aria-hidden="true">{label}</span>
    </button>
  );
}

function GamePosterArt({ accentClass }: { accentClass: string }) {
  return (
    <div className={`slop-create-game-art ${accentClass}`} aria-hidden="true">
      <span className="slop-create-game-spark is-one" />
      <span className="slop-create-game-spark is-two" />
      <span className="slop-create-game-floor" />
      <span className="slop-create-game-character is-left">
        <span className="slop-create-game-head" />
        <span className="slop-create-game-body" />
      </span>
      <span className="slop-create-game-character is-right">
        <span className="slop-create-game-head" />
        <span className="slop-create-game-body" />
      </span>
      <span className="slop-create-game-action" />
    </div>
  );
}

export default function GamesHub() {
  const { account } = useAccount();
  const coins = account.economy.coins;
  const [activeGame, setActiveGame] = useState<GameKey | null>(null);
  const selectedGameCard = activeGame ? gameCards.find((game) => game.key === activeGame) ?? null : null;

  if (selectedGameCard) {
    return (
      <section className="slop-create-page slop-create-page-game slop-main-games-page">
        <div className="slop-create-bg" aria-hidden="true">
          <div className="slop-create-bg-sweep is-pink" />
          <div className="slop-create-bg-sweep is-blue" />
          <div className="slop-create-bg-grid" />
          <div className="slop-create-bg-stars" />
        </div>

        <div className="slop-create-topbar">
          <div className="slop-create-topbar-left">
            <button type="button" className="slop-create-back-button" aria-label="Back to games" onClick={() => setActiveGame(null)}>
              <span aria-hidden="true">{"\u2190"}</span>
            </button>
            <div className="slop-create-title-stack">
              <h1 className="slop-create-title">Slop Arcade</h1>
              <p className="slop-create-subtitle">{selectedGameCard.label}</p>
            </div>
          </div>

          <div className="slop-create-topbar-right">
            <div className="slop-create-coin-pill">
              <span className="slop-create-coin-icon" aria-hidden="true">
                {"\u2605"}
              </span>
              <strong>{coins.toLocaleString()}</strong>
            </div>
            <div className="slop-create-window-actions" aria-label="Window actions">
              <WindowAction label={"\u2212"} />
              <WindowAction label={"\u00D7"} />
              <WindowAction label={"\u00D7"} />
            </div>
          </div>
        </div>

        <div className="slop-game-shell">
          <div className={`slop-game-stage-card ${selectedGameCard.accentClass}`}>
            <div className="slop-game-stage-head">
              <div>
                <p className="slop-game-stage-kicker">{selectedGameCard.kicker}</p>
                <h2 className="slop-game-stage-title">{selectedGameCard.label}</h2>
              </div>
              <span className="slop-game-stage-badge">{selectedGameCard.badge}</span>
            </div>

            <div className="slop-game-stage-screen">
              <div className="slop-game-stage-screen-inner">
                <GamePosterArt accentClass={selectedGameCard.accentClass} />
                <div className="slop-game-stage-overlay">
                  <strong>HTML5 GAME SCREEN</strong>
                  <span>Mount your `{selectedGameCard.label}` canvas, iframe, or engine view here.</span>
                </div>
              </div>
            </div>

            <div className="slop-game-stage-footer">
              <p>{selectedGameCard.description}</p>
              <div className="slop-game-stage-actions">
                <button type="button" className="slop-game-stage-button is-secondary" onClick={() => setActiveGame(null)}>
                  Back To Games
                </button>
                <button type="button" className="slop-game-stage-button is-primary">
                  Mount Game
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="slop-create-page slop-main-games-page">
      <div className="slop-create-bg" aria-hidden="true">
        <div className="slop-create-bg-sweep is-pink" />
        <div className="slop-create-bg-sweep is-blue" />
        <div className="slop-create-bg-grid" />
        <div className="slop-create-bg-stars" />
      </div>

      <div className="slop-create-topbar">
        <div className="slop-create-topbar-left">
          <div className="slop-create-title-stack">
            <h1 className="slop-create-title">Slop Arcade</h1>
            <p className="slop-create-subtitle">Games</p>
          </div>
        </div>

        <div className="slop-create-topbar-right">
          <div className="slop-create-coin-pill">
            <span className="slop-create-coin-icon" aria-hidden="true">
              {"\u2605"}
            </span>
            <strong>{coins.toLocaleString()}</strong>
          </div>
          <div className="slop-create-window-actions" aria-label="Window actions">
            <WindowAction label={"\u2212"} />
            <WindowAction label={"\u00D7"} />
            <WindowAction label={"\u00D7"} />
          </div>
        </div>
      </div>

      <div className="slop-game-shell slop-game-shell--picker">
        <div className="slop-main-games-panel">
          <div className="slop-create-panel-head slop-create-panel-head-games">
            <div className="slop-create-amount-wrap">
              <span className="slop-create-amount-label">Select Game</span>
              <strong className="slop-create-amount-value">3 Modes</strong>
            </div>
            <div className="slop-create-panel-rule" aria-hidden="true" />
          </div>

          <div className="slop-create-games-grid">
            {gameCards.map((game) => (
              <article key={game.key} className={`slop-create-game-card ${game.accentClass}`}>
                <div className="slop-create-game-card-head">
                  <span className="slop-create-game-chip">{game.kicker}</span>
                  <span className="slop-create-game-badge">{game.badge}</span>
                </div>
                <GamePosterArt accentClass={game.accentClass} />
                <div className="slop-create-game-copy">
                  <h3>{game.label}</h3>
                  <p>{game.description}</p>
                </div>
                <button type="button" className="slop-create-game-button" onClick={() => setActiveGame(game.key)}>
                  {game.cta}
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
