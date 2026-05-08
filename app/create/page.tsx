import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SlopTitle from "../components/SlopTitle";

export default function CreatePage() {
  return (
    <div className="route-page">
      <SiteHeader />
      <div className="route-shell">
        <div className="route-page-head">
          <p className="route-page-subtitle">New Entry</p>
          <SlopTitle className="route-page-title">Post A New Entry</SlopTitle>
          <p className="route-copy">
            Drop a fresh listing into the board without leaving the rest of the site flow.
          </p>
        </div>

        <div className="new-entry-layout">
          <article className="route-card new-entry-form-card">
            <div className="new-entry-card-head">
              <SlopTitle as="h3" size="sm">Listing Draft</SlopTitle>
              <span className="new-entry-chip">Board Post</span>
            </div>

            <div className="new-entry-field-grid">
              <input className="route-input" placeholder="Title..." />
              <input className="route-input" placeholder="One-line hook..." />
            </div>

            <textarea className="route-textarea new-entry-textarea" placeholder="Why does this deserve a spot in the rotation?" />

            <div className="new-entry-field-grid">
              <input className="route-input" placeholder="Genre or vibe..." />
              <input className="route-input" placeholder="Image URL..." />
            </div>

            <div className="new-entry-actions">
              <button type="button" className="post-button">
                Submit Entry
              </button>
              <button type="button" className="route-button">
                Save Draft
              </button>
            </div>
          </article>

          <article className="route-card new-entry-side-card">
            <SlopTitle as="h3" size="sm">Entry Notes</SlopTitle>
            <p>Keep the hook fast, the angle obvious, and the screenshot or image loud enough to sell the bit.</p>
            <div className="route-tag-row">
              <span className="route-tag">Trending</span>
              <span className="route-tag">Chaotic</span>
              <span className="route-tag">Debate Bait</span>
            </div>
            <Link href="/catalog" className="route-button">
              Browse Catalog
            </Link>
          </article>
        </div>
      </div>
    </div>
  );
}
