import SlopPageShell from "./components/layout/SlopPageShell";
import NeonPanel from "./components/ui/NeonPanel";
import NeonButton from "./components/ui/NeonButton";
import ChallengeCard from "./components/home/ChallengeCard";

const featureGames = [
  {
    title: "Tag Game",
    badge: "2P",
    copy: "Two blocky slops sprint through neon lanes, juking corners and trading chase pressure.",
    accent: "pink",
  },
  {
    title: "Endless Runner",
    badge: "RUN",
    copy: "A chunky slop charges through traps while a rival shadow racer pushes every jump and dodge.",
    accent: "gold",
  },
  {
    title: "Clash Game",
    badge: "VS",
    copy: "Two slops collide with bursts, shields, and arcade timing in a stylized duel arena.",
    accent: "purple",
  },
] as const;

const newsItems = [
  { title: "Neon Sprint Tournament", copy: "Compete this weekend for exclusive rewards.", age: "2d ago" },
  { title: "New Game: Bubble Brawl", copy: "Pop, clash, win.", age: "5d ago" },
  { title: "Creator Spotlight", copy: "Check out amazing games from our top creators.", age: "1w ago" },
];

const leaderboard = [
  ["PixelMaster", "12,540"],
  ["NeonNinja", "11,230"],
  ["SlopKing", "9,870"],
  ["ArcadeAce (You)", "6,420"],
  ["GameOn77", "5,210"],
];

export default function Home() {
  return (
    <SlopPageShell>
      <div className="slop-home-grid">
        <div className="slop-home-main">
          <NeonPanel variant="blue" className="slop-hero-panel">
            <div className="slop-hero-copy">
              <p className="slop-page-kicker">Welcome To</p>
              <h1 className="slop-hero-title">Slop List</h1>
              <h2 className="slop-hero-subtitle">Discover. Play. Create. Compete.</h2>
              <p className="slop-page-copy">
                Jump into a universe of wild arcade games made by the community, for the community.
              </p>
              <NeonButton href="/games" variant="pink" className="slop-hero-button">
                Explore Games
              </NeonButton>
            </div>
            <div className="slop-hero-art" aria-hidden="true">
              <span className="slop-hero-arcade" />
              <span className="slop-hero-coin" />
              <span className="slop-hero-ufo" />
            </div>
          </NeonPanel>

          <NeonPanel variant="purple" className="slop-featured-games">
            <div className="slop-home-section-head">
              <h2>Featured Games</h2>
              <NeonButton href="/games" variant="purple">
                View All Games
              </NeonButton>
            </div>
            <div className="slop-featured-games-grid">
              {featureGames.map((game) => (
                <article key={game.title} className={`slop-feature-card is-${game.accent}`}>
                  <div className="slop-feature-card__art" aria-hidden="true">
                    <span className="slop-feature-card__badge">{game.badge}</span>
                  </div>
                  <strong>{game.title}</strong>
                  <p>{game.copy}</p>
                  <NeonButton href="/games" variant={game.accent === "gold" ? "gold" : "pink"}>
                    Play Now
                  </NeonButton>
                </article>
              ))}
            </div>
          </NeonPanel>

          <div className="slop-home-promo-row">
            <NeonPanel variant="dark" className="slop-home-promo-card">
              <strong>Play Games</strong>
              <p>Explore hundreds of arcade games.</p>
            </NeonPanel>
            <NeonPanel variant="dark" className="slop-home-promo-card">
              <strong>Create & Share</strong>
              <p>Build your own slops and share them.</p>
            </NeonPanel>
            <NeonPanel variant="dark" className="slop-home-promo-card">
              <strong>Earn Rewards</strong>
              <p>Complete challenges and earn stars.</p>
            </NeonPanel>
            <NeonPanel variant="dark" className="slop-home-promo-card">
              <strong>Join The Community</strong>
              <p>Connect, compete, and have fun.</p>
            </NeonPanel>
          </div>
        </div>

        <div className="slop-home-sidebar">
          <NeonPanel variant="pink" className="slop-home-sidebar-panel">
            <h2>Daily Challenge</h2>
            <ChallengeCard title="High Score Hunter" copy="Score 10,000 points in any arcade game." reward={50} progress={6420} total={10000} />
          </NeonPanel>

          <NeonPanel variant="purple" className="slop-home-sidebar-panel">
            <div className="slop-home-section-head">
              <h2>News & Updates</h2>
            </div>
            <div className="slop-news-list">
              {newsItems.map((item) => (
                <article key={item.title} className="slop-news-card">
                  <strong>{item.title}</strong>
                  <p>{item.copy}</p>
                  <span>{item.age}</span>
                </article>
              ))}
            </div>
          </NeonPanel>

          <NeonPanel variant="blue" className="slop-home-sidebar-panel">
            <div className="slop-home-section-head">
              <h2>Leaderboard</h2>
            </div>
            <ol className="slop-leaderboard">
              {leaderboard.map(([name, score], index) => (
                <li key={name} className="slop-leaderboard-row">
                  <span>{index + 1}</span>
                  <strong>{name}</strong>
                  <span>★ {score}</span>
                </li>
              ))}
            </ol>
          </NeonPanel>
        </div>
      </div>
    </SlopPageShell>
  );
}
