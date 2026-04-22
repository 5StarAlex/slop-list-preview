import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SlopTitle from "../components/SlopTitle";

export default function CreatePage() {
  return (
    <div className="route-page">
      <SiteHeader />
      <div className="route-shell">
        <div className="route-page-head">
          <p className="route-page-subtitle">Create Slop</p>
          <SlopTitle className="route-page-title">Create-A-Slop</SlopTitle>
          <p className="route-copy">
            Pitch a new disaster, drop the one-line hook, and feed the board.
          </p>
        </div>

        <div className="route-grid">
          <article className="route-card">
            <SlopTitle as="h3" size="sm">New Title</SlopTitle>
            <input className="route-input" placeholder="Anime title..." />
            <input className="route-input" placeholder="One line pitch..." />
            <textarea
              className="route-textarea"
              placeholder="Why should this be in the slop rotation?"
            />
            <button type="button" className="post-button">
              Submit Entry
            </button>
          </article>

          <article className="route-card">
            <SlopTitle as="h3" size="sm">Current Build Tips</SlopTitle>
            <p>Keep the pitch short, make the angle obvious, and lean into the chaos.</p>
            <div className="route-tag-row">
              <span className="route-tag">Romance</span>
              <span className="route-tag">Action</span>
              <span className="route-tag">Messy</span>
            </div>
            <Link href="/about" className="route-button">
              Read About
            </Link>
          </article>
        </div>
      </div>
    </div>
  );
}
