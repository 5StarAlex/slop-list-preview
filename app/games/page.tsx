"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ComicShell from "../components/ComicShell";
import { useAccount } from "../components/AccountProvider";

type ArcadeGame = {
  slug: string;
  title: string;
  description: string;
  modes: string[];
  score: number;
  distance: string;
  played: number;
  tone: "pink" | "blue" | "gold" | "green" | "violet" | "purple";
  scene: "sprint" | "battle" | "slide" | "soccer" | "stealth" | "karts";
};

const arcadeGames: ArcadeGame[] = [
  {
    slug: "endless-runner",
    title: "Neon Sprint",
    description: "Dash through vibrant neon worlds, dodge obstacles, and see how far you can go.",
    modes: ["Run", "Endless"],
    score: 2450,
    distance: "4,892m",
    played: 28,
    tone: "pink",
    scene: "sprint",
  },
  {
    slug: "clash-game",
    title: "Slop Battle",
    description: "Duel another slop in fast-paced 1v1 clash matches.",
    modes: ["PVP", "1V1"],
    score: 1890,
    distance: "1,240m",
    played: 16,
    tone: "blue",
    scene: "battle",
  },
  {
    slug: "slop-runner",
    title: "Slip & Slide",
    description: "Slide, jump, and time your moves across tricky platforms.",
    modes: ["Skill", "Platformer"],
    score: 1320,
    distance: "2,060m",
    played: 11,
    tone: "gold",
    scene: "slide",
  },
  {
    slug: "tag-game",
    title: "Slop Soccer",
    description: "Score goals, make plays, and lead your team to victory.",
    modes: ["Sports", "Team"],
    score: 980,
    distance: "740m",
    played: 9,
    tone: "green",
    scene: "soccer",
  },
  {
    slug: "tag-game",
    title: "Stealth Slop",
    description: "Sneak, hide, and outsmart the last slop standing.",
    modes: ["Stealth", "Battle Royale"],
    score: 1750,
    distance: "1,880m",
    played: 13,
    tone: "violet",
    scene: "stealth",
  },
  {
    slug: "endless-runner",
    title: "Slop Karts",
    description: "Drift, boost, and race to the finish line in chaotic kart races.",
    modes: ["Racing", "Multiplayer"],
    score: 1210,
    distance: "3 laps",
    played: 7,
    tone: "purple",
    scene: "karts",
  },
];

const leaders = [
  ["NeonGlitch", "13,420", "glitch"],
  ["PixelPunk", "11,090", "punk"],
  ["TurboToast", "8,765", "toast"],
  ["SlopMaster", "7,240", "master"],
  ["GlitchySlop", "6,180", "slop"],
  ["VoidRunner", "5,320", "void"],
  ["SlopKid", "4,910", "kid"],
] as const;

const filters = ["All Modes", "Endless", "PVP", "Skill", "Racing"] as const;

function GameScene({ scene, large = false }: { scene: ArcadeGame["scene"]; large?: boolean }) {
  return (
    <div className={`arcade-scene is-${scene} ${large ? "is-large" : ""}`} aria-hidden="true">
      <span className="arcade-scene-grid" />
      <span className="arcade-scene-slop" />
      <span className="arcade-scene-slop is-rival" />
      <span className="arcade-scene-ball" />
      <span className="arcade-scene-obstacle is-one" />
      <span className="arcade-scene-obstacle is-two" />
    </div>
  );
}

export default function GamesPage() {
  const { account } = useAccount();
  const [selectedSlug, setSelectedSlug] = useState(arcadeGames[0].title);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All Modes");

  const visibleGames = useMemo(
    () =>
      arcadeGames.filter((game) => {
        const matchesQuery = `${game.title} ${game.description} ${game.modes.join(" ")}`.toLowerCase().includes(query.toLowerCase());
        const matchesFilter = filter === "All Modes" || game.modes.some((mode) => mode.toLowerCase() === filter.toLowerCase());
        return matchesQuery && matchesFilter;
      }),
    [filter, query],
  );

  const selectedGame = arcadeGames.find((game) => game.title === selectedSlug) ?? visibleGames[0] ?? arcadeGames[0];

  return (
    <ComicShell className="arcade-hub-page">
      <main className="arcade-hub">
        <header className="arcade-hub-title">
          <div>
            <h1>Arcade</h1>
            <span aria-hidden="true" />
            <p>Play games, earn items, and climb the leaderboard!</p>
          </div>
          <strong><span aria-hidden="true">★</span> {account.economy.coins}</strong>
        </header>

        <section className="arcade-hub-layout">
          <div className="arcade-game-browser">
            <div className="arcade-search-row">
              <label>
                <span aria-hidden="true">⌕</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search games..." />
              </label>
              <select value={filter} onChange={(event) => setFilter(event.target.value as (typeof filters)[number])} aria-label="Filter games">
                {filters.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>

            <div className="arcade-game-list">
              {visibleGames.map((game) => (
                <article key={game.title} className={`arcade-game-row is-${game.tone} ${selectedGame.title === game.title ? "is-active" : ""}`}>
                  <button type="button" onClick={() => setSelectedSlug(game.title)} aria-label={`Select ${game.title}`}>
                    <GameScene scene={game.scene} />
                    <span>
                      <strong>{game.title}</strong>
                      <em>{game.description}</em>
                      <span>
                        {game.modes.map((mode) => <mark key={mode}>{mode}</mark>)}
                      </span>
                    </span>
                  </button>
                  <div>
                    <Link href={`/games/${game.slug}`}>Play</Link>
                    <small><span aria-hidden="true">★</span> {game.score.toLocaleString()}</small>
                  </div>
                </article>
              ))}
            </div>

            <footer className="arcade-random-row">
              <span>Can&apos;t find what you&apos;re looking for?</span>
              <button type="button" onClick={() => setSelectedSlug(arcadeGames[Math.floor(Math.random() * arcadeGames.length)].title)}>
                Random Game <span aria-hidden="true">⤨</span>
              </button>
            </footer>
          </div>

          <aside className="arcade-detail-panel">
            <GameScene scene={selectedGame.scene} large />
            <div className="arcade-detail-copy">
              <h2>{selectedGame.title}</h2>
              <div>{selectedGame.modes.map((mode) => <mark key={mode}>{mode}</mark>)}</div>
              <p>{selectedGame.description}</p>
            </div>

            <div className="arcade-stat-strip">
              <article><span>Best Score</span><strong><span aria-hidden="true">★</span> {selectedGame.score.toLocaleString()}</strong></article>
              <article><span>Best Distance</span><strong>{selectedGame.distance}</strong></article>
              <article><span>Played</span><strong>{selectedGame.played}</strong></article>
            </div>

            <section className="arcade-leaderboard-panel">
              <header>
                <h3>Leaderboard <span aria-hidden="true">↻</span></h3>
                <nav aria-label="Leaderboard scope">
                  <button type="button" className="is-active">Global</button>
                  <button type="button">Friends</button>
                  <button type="button">Local</button>
                </nav>
              </header>
              <ol>
                {leaders.map(([name, score, avatar], index) => (
                  <li key={name} className={index < 3 ? "is-medal" : ""}>
                    <span>{index + 1}</span>
                    <i className={`arcade-player-face is-${avatar}`} />
                    <strong>{name}</strong>
                    <em><span aria-hidden="true">★</span> {score}</em>
                  </li>
                ))}
              </ol>
            </section>

            <div className="arcade-reward-callout">
              <span aria-hidden="true">▣</span>
              <p>Keep playing to climb the leaderboard and earn exclusive rewards!</p>
            </div>
          </aside>
        </section>
      </main>
    </ComicShell>
  );
}
