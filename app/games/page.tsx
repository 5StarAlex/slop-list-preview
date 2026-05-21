import ComicShell from "../components/ComicShell";

const games = [
  {
    ribbon: "ARCADE RUSH",
    badge: "2P",
    title: "TAG GAME",
    copy: "Two blocky slops sprint through neon lanes, juking corners and trading chase pressure.",
    button: "PLAY TAG",
    tone: "blue",
    stats: ["PLAYERS 2", "PACE FAST", "ARENA NEON CITY"],
  },
  {
    ribbon: "NEON SPRINT",
    badge: "RUN",
    title: "ENDLESS RUNNER",
    copy: "A chunky slop charges through traps while a rival shadow racer pushes every jump and dodge.",
    button: "START RUN",
    tone: "yellow",
    stats: ["MODE ENDLESS", "BEST 2,480M", "DIFFICULTY HARD"],
  },
  {
    ribbon: "ARENA CLASH",
    badge: "VS",
    title: "CLASH GAME",
    copy: "Two blocky slops collide with bursts, shields, and arcade timing in a stylized duel arena.",
    button: "ENTER CLASH",
    tone: "pink",
    stats: ["PLAYERS 2", "POWER-UPS ON", "BEST OF 3"],
  },
] as const;

const leaders = [
  ["NeonGlitch", "13,420"],
  ["PixelPunk", "11,090"],
  ["TurboToast", "8,765"],
  ["SlopKing23", "6,540"],
  ["ByteBoi", "5,310"],
] as const;

export default function GamesPage() {
  return (
    <ComicShell className="comic-games-page">
      <main className="comic-arcade">
        <header className="comic-page-title">
          <div>
            <h1>SLOP ARCADE</h1>
            <p>GAMES</p>
          </div>
          <div className="comic-window-controls">
            <span>{"\u2b50"} 20</span>
            <button type="button">{"\u2212"}</button>
            <button type="button">{"\u00d7"}</button>
            <button type="button">{"\u00d7"}</button>
          </div>
        </header>

        <section className="comic-arcade-board">
          <div className="comic-arcade-head">
            <div>
              <h2>SELECT GAME</h2>
              <p>Choose your slop and jump into the action!</p>
            </div>
            <strong>{"\u2606"} 3 MODES</strong>
          </div>

          <div className="comic-game-grid">
            {games.map((game) => (
              <article key={game.title} className={`comic-game-card is-${game.tone}`}>
                <div className="comic-game-ribbon">{game.ribbon}</div>
                <span className="comic-game-badge">{game.badge}</span>
                <div className="comic-game-art">
                  <span className="comic-mini-slop is-left" />
                  <span className="comic-mini-slop is-right" />
                  <span className="comic-impact-line" />
                </div>
                <h3>{game.title}</h3>
                <p>{game.copy}</p>
                <div className="comic-game-stats">
                  {game.stats.map((stat) => <span key={stat}>{stat}</span>)}
                </div>
                <button type="button">{game.button}</button>
              </article>
            ))}
          </div>
        </section>

        <section className="comic-arcade-info">
          <div className="comic-info-strip">
            <h2>ARCADE INFO</h2>
            <article><span>{"\ud83c\udfae"}</span><strong>CONTROLS</strong><p>Easy to learn, hard to master!</p></article>
            <article><span>{"\u2606"}</span><strong>EARN STARS</strong><p>Win matches and complete challenges to earn stars!</p></article>
            <article><span>{"\ud83d\udcc5"}</span><strong>DAILY CHALLENGES</strong><p>New challenges every day. More stars, better rewards!</p></article>
            <article><span>{"\ud83c\udf81"}</span><strong>REWARDS</strong><p>Unlock avatars, themes, emotes and more!</p></article>
          </div>

          <aside className="comic-arcade-leaderboard">
            <h2>LEADERBOARD</h2>
            <ol>
              {leaders.map(([name, score], index) => (
                <li key={name}><span>{index + 1}</span><strong>{name}</strong><em>{"\u2b50"} {score}</em></li>
              ))}
            </ol>
            <button type="button">VIEW LEADERBOARD</button>
          </aside>
        </section>
      </main>
    </ComicShell>
  );
}
