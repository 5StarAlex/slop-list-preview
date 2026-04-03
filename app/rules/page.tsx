import Link from "next/link";
import SiteHeader from "../components/SiteHeader";

const rules = [
  "Get involved with discussion posts if you want your slop coin total to move.",
  "Rank shows with an actual take instead of clicking an emoji and dipping.",
  "Engagement bait is allowed if it is funny enough to deserve the chaos it causes.",
  "Do not be broke in spirit or in posting effort. Feed the board.",
];

export default function RulesPage() {
  return (
    <div className="route-page">
      <SiteHeader />
      <div className="route-shell">
        <div className="route-page-head">
          <p className="route-page-subtitle">Slop Rules</p>
          <h1 className="route-page-title">Board Rules</h1>
          <p className="route-copy">
            The site stays fun when the board is chaotic on purpose instead of by accident.
          </p>
        </div>

        <div className="route-grid">
          {rules.map((rule) => (
            <article key={rule} className="route-card">
              <h3>Rule</h3>
              <p>{rule}</p>
            </article>
          ))}
        </div>

        <div className="route-box-list">
          <Link href="/" className="route-button">
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
