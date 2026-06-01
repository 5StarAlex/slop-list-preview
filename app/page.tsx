"use client";

import Image from "next/image";
import Link from "next/link";
import ComicShell from "./components/ComicShell";
import { useAccount } from "./components/AccountProvider";

const runnerUps = [
  ["NeonGlitch", "13,420"],
  ["PixelPunk", "11,090"],
  ["TurboToast", "8,765"],
  ["SlopKing23", "6,540"],
] as const;

const hubCards = [
  { title: "Daily Quest", copy: "+250 coins waiting", href: "/games", tone: "orange" },
  { title: "Watch List", copy: "Saved anime and ratings", href: "/catalog", tone: "cyan" },
  { title: "Community", copy: "Posts, polls, and reactions", href: "/community", tone: "purple" },
] as const;

const topSlopCards = [
  { title: "PIXEL OUTLAW", subtitle: "Hot pick", className: "is-outlaw" },
  { title: "RWBY", subtitle: "Arcade mayhem", className: "is-rwby" },
  { title: "IDOL REBOOT", subtitle: "Rising slop", className: "is-idol" },
] as const;

export default function Home() {
  const { account } = useAccount();
  const kingProfile = account.profile;
  const kingScore = account.economy.coins.toLocaleString();

  return (
    <ComicShell className="experiment-home-page">
      <main className="experiment-home" aria-label="Slop List home hub">
        <section className="experiment-hero" aria-label="Slop List launch hub">
          <div className="experiment-hero-copy">
            <p>Welcome back, {kingProfile.displayName}</p>
            <h1>SLOP LIST HOME</h1>
            <span>
              Your game-style hub for creating slop, tracking anime, ranking favorites,
              posting with the community, and jumping into arcade rewards.
            </span>
          </div>

          <section className="experiment-card-grid" aria-label="Quick actions">
            {hubCards.map((card) => (
              <Link key={card.title} href={card.href} className={`experiment-action-card is-${card.tone}`}>
                <b>{card.title}</b>
                <small>{card.copy}</small>
              </Link>
            ))}
          </section>

          <Link href="/create" className="experiment-cta">
            CREATE SLOP
          </Link>

          <div className="experiment-poster-card" aria-label="Create A Slop poster">
            <Image
              src="/assets/home/hero/create-slop-home-panel-v2.png"
              alt="Slop List poster with Create A Slop headline and anime character"
              fill
              priority
              sizes="(max-width: 900px) 92vw, 34vw"
              className="experiment-poster-image"
              unoptimized
            />
          </div>
        </section>

        <aside className="experiment-speech" aria-label="Guide message">
          Pick a tab. The whole site is your arcade menu now.
        </aside>

        <section className="experiment-mascot" aria-hidden="true">
          <div className="experiment-crown" />
          <div className="experiment-head">
            <div className="experiment-eye is-one" />
            <div className="experiment-eye is-two" />
            <div className="experiment-mouth" />
          </div>
          <div className="experiment-arm is-left" />
          <div className="experiment-arm is-right" />
          <div className="experiment-body" />
          <div className="experiment-leg is-left" />
          <div className="experiment-leg is-right" />
        </section>

        <aside className="experiment-king-panel" aria-label="King of Slop leaderboard">
          <div className="experiment-panel-head">
            <span aria-hidden="true">*</span>
            <h2>KING OF SLOP</h2>
            <span aria-hidden="true">*</span>
          </div>
          <div className="experiment-ribbon">{kingProfile.displayName}</div>
          <div className="experiment-king-stage">
            <span className="experiment-king-avatar">
              <Image src={kingProfile.profileImage} alt={`${kingProfile.displayName} avatar`} fill unoptimized />
            </span>
            <div>
              <strong>{kingProfile.username}</strong>
              <em>{kingProfile.affiliation}</em>
              <p>{kingScore} stars banked</p>
            </div>
          </div>
          <ol className="experiment-runners">
            {runnerUps.map(([name, score], index) => (
              <li key={name}>
                <span>{index + 1}</span>
                <strong>{name}</strong>
                <em>* {score}</em>
              </li>
            ))}
          </ol>
        </aside>

        <section className="experiment-top-slop" aria-label="Top Slop carousel">
          <header>
            <h2>TOP SLOP</h2>
            <Link href="/catalog">VIEW ALL</Link>
          </header>
          <div className="experiment-slop-row">
            {topSlopCards.map((card, index) => (
              <article key={card.title} className={`experiment-slop-card ${card.className}${index === 1 ? " is-featured" : ""}`}>
                <span aria-hidden="true" />
                <strong>{card.title}</strong>
                <small>{card.subtitle}</small>
              </article>
            ))}
          </div>
        </section>

        <div className="experiment-bottom-chat">
          Slop List is live: create, rate, watch, post, shop, and play from the left-side tabs.
        </div>
      </main>
    </ComicShell>
  );
}
