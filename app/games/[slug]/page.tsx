import Link from "next/link";
import ComicShell from "../../components/ComicShell";

type GamePlanPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GamePlanPage({ params }: GamePlanPageProps) {
  const { slug } = await params;
  const gameName = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    <ComicShell className="comic-games-page">
      <main className="comic-arcade">
        <header className="comic-page-title">
          <div>
            <h1>{gameName}</h1>
            <p>GAME PLAN</p>
          </div>
          <Link href="/games" className="comic-back-button">{"\u2039"} Back</Link>
        </header>
        <section className="comic-arcade-board comic-game-plan">
          <h2>HTML5 GAME PLANNER</h2>
          <p>Use this room to define controls, scoring, assets, and release goals for {gameName}.</p>
          <div className="comic-game-plan-grid">
            <article><strong>Controls</strong><span>Keyboard, touch, and controller mapping.</span></article>
            <article><strong>Scoring</strong><span>Stars, combos, timers, and streak rewards.</span></article>
            <article><strong>Assets</strong><span>Sprites, stage art, sound effects, and UI states.</span></article>
            <article><strong>Release</strong><span>Import checklist for the final HTML5 build.</span></article>
          </div>
        </section>
      </main>
    </ComicShell>
  );
}
