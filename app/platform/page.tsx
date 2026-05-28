"use client";

import Link from "next/link";
import ComicShell from "../components/ComicShell";
import { useAccount } from "../components/AccountProvider";
import SlopCharacterPreview from "../components/character/SlopCharacterPreview";
import { getUserById, kingOfSlopEntries, platformPosts, platformSchemaChecklist } from "../lib/platformData";

const buildTracks = [
  { label: "Identity", value: "Auth + profiles", status: "Schema ready" },
  { label: "Personal data", value: "Watchlist, avatar, coins", status: "Local adapter now" },
  { label: "UGC", value: "Posts, comments, reactions", status: "Community shell" },
  { label: "Games", value: "Avatar canvas runtime", status: "Playable stub" },
] as const;

export default function PlatformPage() {
  const { account, isAuthenticated } = useAccount();
  const kingEntry = kingOfSlopEntries[0];
  const kingUser = getUserById(kingEntry.userId);

  return (
    <ComicShell>
      <main className="platform-home">
        <section className="platform-hero-panel">
          <div className="platform-hero-copy">
            <span className="platform-kicker">UGC platform framework</span>
            <h1>Slop List is becoming a real community arcade.</h1>
            <p>
              Profiles, saved characters, watchlists, coins, public posts, King of Slop entries,
              moderation hooks, and HTML5 games now point at one database-ready platform model.
            </p>
            <div className="platform-action-row">
              <Link href="/community">Open Community</Link>
              <Link href="/games/slop-runner">Test Avatar Game</Link>
            </div>
          </div>
          <aside className="platform-player-card" aria-label="Signed in player state">
            <div className="platform-player-stage">
              <SlopCharacterPreview config={account.characterConfig} equippedShopItemIds={account.equippedShopItemIds} pedestal />
            </div>
            <div>
              <span>{isAuthenticated ? "Signed in prototype user" : "Prototype account"}</span>
              <h2>{account.profile.displayName}</h2>
              <p>@{account.profile.username}</p>
            </div>
            <div className="platform-stat-row">
              <span><strong>{account.economy.coins}</strong>Stars</span>
              <span><strong>{account.progression.level}</strong>Level</span>
              <span><strong>{account.progression.xp}</strong>XP</span>
            </div>
          </aside>
        </section>

        <section className="platform-grid">
          <article className="platform-card platform-king-card">
            <header>
              <span className="platform-kicker">Live event</span>
              <h2>King of Slop</h2>
            </header>
            <div className="platform-king-body">
              <div className="platform-mini-avatar">
                <SlopCharacterPreview config={kingUser.characterConfig} equippedShopItemIds={[]} pedestal />
              </div>
              <div>
                <strong>{kingUser.displayName}</strong>
                <p>{kingEntry.pitch}</p>
                <span>{kingEntry.score.toLocaleString()} stars</span>
              </div>
            </div>
            <ol className="platform-rank-list">
              {kingOfSlopEntries.map((entry) => {
                const user = getUserById(entry.userId);
                return (
                  <li key={entry.id}>
                    <span>{entry.rank}</span>
                    <strong>{user.displayName}</strong>
                    <em>{entry.score.toLocaleString()}</em>
                  </li>
                );
              })}
            </ol>
          </article>

          <article className="platform-card">
            <header>
              <span className="platform-kicker">Framework</span>
              <h2>Database Plan</h2>
            </header>
            <ul className="platform-check-list">
              {platformSchemaChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link href="/community" className="platform-inline-link">See public UGC flow</Link>
          </article>

          <article className="platform-card platform-feed-preview">
            <header>
              <span className="platform-kicker">Everyone can see this</span>
              <h2>Community Feed</h2>
            </header>
            {platformPosts.slice(0, 3).map((post) => {
              const user = getUserById(post.authorId);
              return (
                <div key={post.id} className="platform-feed-row">
                  <span>{post.tag}</span>
                  <strong>{post.title}</strong>
                  <p>{user.displayName} - {post.createdAt} - {post.reactions} reactions</p>
                </div>
              );
            })}
          </article>

          <article className="platform-card platform-build-card">
            <header>
              <span className="platform-kicker">Build tracks</span>
              <h2>What Is Wired</h2>
            </header>
            <div className="platform-build-list">
              {buildTracks.map((track) => (
                <div key={track.label}>
                  <span>{track.label}</span>
                  <strong>{track.value}</strong>
                  <em>{track.status}</em>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </ComicShell>
  );
}
