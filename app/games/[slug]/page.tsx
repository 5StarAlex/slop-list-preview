import Link from "next/link";
import ComicShell from "../../components/ComicShell";
import AvatarGameRuntime from "../../components/games/AvatarGameRuntime";
import { getGameBySlug } from "../../lib/platformData";

type GamePlanPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GamePlanPage({ params }: GamePlanPageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  return (
    <ComicShell className="comic-games-page">
      <main className="comic-arcade">
        <header className="comic-page-title">
          <div>
            <h1>{game.title}</h1>
            <p>{game.engine.toUpperCase()} AVATAR GAME</p>
          </div>
          <Link href="/games" className="comic-back-button">{"\u2039"} Back</Link>
        </header>

        <AvatarGameRuntime title={game.title} rewardRule={game.rewardRule} />

        <section className="comic-arcade-board game-framework-board">
          <h2>Game Integration Contract</h2>
          <div className="comic-game-plan-grid">
            <article><strong>Avatar input</strong><span>Read `character_configs.config` and equipped item ids for the logged-in user.</span></article>
            <article><strong>Runtime</strong><span>Embed Canvas, Phaser, or an uploaded HTML5 build inside this route shell.</span></article>
            <article><strong>Score submit</strong><span>Send signed session id, score, duration, and character snapshot to the server.</span></article>
            <article><strong>Rewards</strong><span>Server validates the run, writes `game_scores`, then creates an economy transaction.</span></article>
          </div>
        </section>
      </main>
    </ComicShell>
  );
}
