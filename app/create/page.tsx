import Link from "next/link";
import SiteHeader from "../components/SiteHeader";

export default function CreatePage() {
  return (
    <div className="route-page">
      <SiteHeader />
      <div className="route-shell">
        <div className="route-page-head">
          <p className="route-page-subtitle">Create Slop</p>
          <h1 className="route-page-title">Build A Fresh Entry</h1>
          <p className="route-copy">
            Pitch a new disaster, drop the one-line hook, and feed the board.
          </p>
        </div>

        <div className="route-grid">
          <article className="route-card">
            <h3>New Title</h3>
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
            <h3>Current Build Tips</h3>
            <p>Keep the pitch short, make the angle obvious, and lean into the chaos.</p>
            <div className="route-tag-row">
              <span className="route-tag">Romance</span>
              <span className="route-tag">Action</span>
              <span className="route-tag">Messy</span>
            </div>
            <Link href="/" className="route-button">
              Back Home
            </Link>
          </article>
        </div>
      </div>
    </div>
  );
}
