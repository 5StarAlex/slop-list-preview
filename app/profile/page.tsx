import Link from "next/link";
import SiteHeader from "../components/SiteHeader";

export default function ProfilePage() {
  return (
    <div className="route-page">
      <SiteHeader />
      <div className="route-shell">
        <div className="route-page-head">
          <p className="route-page-subtitle">Profile</p>
          <h1 className="route-page-title">Your Slop Profile</h1>
          <p className="route-copy">
            Track your coin count, your posting energy, and the kind of chaos you bring.
          </p>
        </div>

        <div className="route-grid">
          <article className="route-card">
            <h3>Coin Snapshot</h3>
            <p>5820 coins and climbing from posts, reactions, and board comments.</p>
            <div className="route-tag-row">
              <span className="route-tag">Top Poster</span>
              <span className="route-tag">Rom-Com Brain</span>
            </div>
          </article>

          <article className="route-card">
            <h3>Current Badges</h3>
            <p>Tastemaker, lore goblin, and repeat argument starter.</p>
            <Link href="/" className="route-button">
              Back Home
            </Link>
          </article>
        </div>
      </div>
    </div>
  );
}
