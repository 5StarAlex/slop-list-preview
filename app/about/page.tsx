import SiteHeader from "../components/SiteHeader";

const rules = [
  "Get involved with discussion posts if you want your slop coin total to move.",
  "Rank shows with an actual take instead of clicking an emoji and dipping.",
  "Engagement bait is allowed if it is funny enough to deserve the chaos it causes.",
  "Do not be broke in spirit or in posting effort. Feed the board.",
];

export default function AboutPage() {
  return (
    <div className="route-page">
      <SiteHeader />
      <div className="route-shell">
        <div className="route-page-head">
          <p className="route-page-subtitle">About</p>
          <h1 className="route-page-title">About The Slop List</h1>
          <p className="route-copy">
            The board runs on loud opinions, dumb commitment, and just enough structure to keep the
            chaos readable.
          </p>
        </div>

        <div className="route-grid">
          <article className="route-card">
            <h3>What This Is</h3>
            <p>
              The Slop List is a pixel-chaos board for ranking, collecting, and rotating through the
              most watchable disasters and favorite guilty pleasures we can find.
            </p>
          </article>

          <article className="route-card">
            <h3>Board Rules</h3>
            <div className="about-rule-list">
              {rules.map((rule) => (
                <p key={rule}>{rule}</p>
              ))}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
