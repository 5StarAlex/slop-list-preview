import Image from "next/image";
import Link from "next/link";
import ComicShell from "./components/ComicShell";

const runnerUps = [
  ["NeonGlitch", "13,420"],
  ["PixelPunk", "11,090"],
  ["TurboToast", "8,765"],
  ["SlopKing23", "6,540"],
  ["ByteBoi", "5,310"],
] as const;

const topSlopCards = [
  { title: "PIXEL OUTLAW", subtitle: "", className: "is-outlaw" },
  { title: "RWBY", subtitle: "ARCADE MAYHEM", className: "is-rwby" },
  { title: "IDOL REBOOT", subtitle: "", className: "is-idol" },
] as const;

export default function Home() {
  return (
    <ComicShell>
      <main className="demo2-board">
        <section className="demo2-hero-poster" aria-label="Create a slop">
          <Image
            src="/demo-2/home-poster.png"
            alt="Slop List poster with Create A Slop headline and anime character"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 66vw"
            className="demo2-hero-poster-image"
          />
          <Link href="/create" className="demo2-create-button" aria-label="New slop entry">
            <Image
              src="/demo-2/create-a-slop-button.png"
              alt="New slop entry"
              fill
              priority
              sizes="30vw"
              className="demo2-create-button-image"
            />
          </Link>
          <span className="demo2-float-star is-one" aria-hidden="true" />
          <span className="demo2-float-star is-two" aria-hidden="true" />
        </section>

        <aside className="demo2-king-panel" aria-label="King of Slop leaderboard">
          <div className="demo2-panel-frame">
            <div className="demo2-king-head">
              <span aria-hidden="true">{"\u2606"}</span>
              <h1>KING OF SLOP</h1>
              <span aria-hidden="true">{"\u2606"}</span>
            </div>
            <div className="demo2-ribbon">ARIAL ACE</div>

            <div className="demo2-king-stage">
              <div className="demo2-king-figure" aria-label="King slop character">
                <span className="demo2-king-crown" aria-hidden="true">{"\u2655"}</span>
                <span className="demo2-king-face" aria-hidden="true" />
                <span className="demo2-king-body" aria-hidden="true" />
                <span className="demo2-king-arm is-left" aria-hidden="true" />
                <span className="demo2-king-arm is-right" aria-hidden="true" />
                <span className="demo2-king-leg is-left" aria-hidden="true" />
                <span className="demo2-king-leg is-right" aria-hidden="true" />
              </div>
              <div className="demo2-medal-stack" aria-label="King of Slop stats">
                <span><strong>{"\u2655"}</strong> 1</span>
                <span><strong>{"\u2605"}</strong> 15,230</span>
              </div>
            </div>

            <div className="demo2-runner-panel">
              <div className="demo2-runner-ribbon">RUNNER UP</div>
              <ol>
                {runnerUps.map(([name, score], index) => (
                  <li key={name}>
                    <span className="demo2-runner-face" aria-hidden="true">{"\u263b"}</span>
                    <span className="demo2-runner-rank">{index + 1}</span>
                    <strong>{name}</strong>
                    <span className="demo2-runner-score"><span aria-hidden="true">{"\u2605"}</span> {score}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </aside>

        <section className="demo2-top-slop" aria-label="Top Slop carousel">
          <button type="button" className="demo2-carousel-arrow is-left" aria-label="Previous top slop">
            {"\u2039"}
          </button>
          <div className="demo2-top-slop-title">
            <span aria-hidden="true">{"\u265b"}</span>
            <h2>TOP SLOP</h2>
            <Link href="/create" aria-label="Add top slop">+</Link>
          </div>
          <div className="demo2-card-row">
            {topSlopCards.map((card, index) => (
              <article key={card.title} className={`demo2-slop-card ${card.className}${index === 1 ? " is-featured" : ""}`}>
                <div className="demo2-slop-card-art">
                  <span className="demo2-card-figure is-a" aria-hidden="true" />
                  <span className="demo2-card-figure is-b" aria-hidden="true" />
                  <span className="demo2-card-splash" aria-hidden="true" />
                </div>
                <strong>{card.title}</strong>
                {card.subtitle ? <span>{card.subtitle}</span> : null}
              </article>
            ))}
          </div>
          <div className="demo2-carousel-dots" aria-hidden="true">
            <span className="is-active" />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <button type="button" className="demo2-carousel-arrow is-right" aria-label="Next top slop">
            {"\u203a"}
          </button>
        </section>
      </main>
    </ComicShell>
  );
}
