import Link from "next/link";
import ComicShell from "../components/ComicShell";

const items = ["Blank Tee", "Cloud Hoc", "Volt Jacket", "Star Blazer", "Pixel Crew", "Neon Guard"] as const;

export default function ProfilePage() {
  return (
    <ComicShell className="comic-studio-page">
      <main className="comic-studio">
        <header className="comic-page-title">
          <Link href="/" className="comic-back-button" aria-label="Back home">{"\u2039"}</Link>
          <div>
            <h1>SLOP STUDIO</h1>
            <p>INVENTORY</p>
          </div>
          <div className="comic-window-controls">
            <span>{"\u2b50"} 20</span>
            <button type="button">{"\u2212"}</button>
            <button type="button">{"\u00d7"}</button>
            <button type="button">{"\u00d7"}</button>
          </div>
        </header>

        <section className="comic-studio-grid">
          <aside className="comic-avatar-builder">
            {["HEAD", "ARMS", "EFFECT", "TOP", "BOTTOM", "FOOTPRINT"].map((slot) => (
              <button type="button" key={slot} className={`comic-slot is-${slot.toLowerCase()}`}>
                <span>{slot}</span>
                <strong>{slot === "TOP" ? "\ud83d\udc55" : slot === "BOTTOM" ? "\ud83d\udc56" : slot === "EFFECT" ? "\ud83d\udfe2" : slot === "FOOTPRINT" ? "\u26f0" : "..."}</strong>
                <em>{"\u2605"}</em>
              </button>
            ))}
            <div className="comic-studio-character">
              <span className="comic-studio-head" />
              <span className="comic-studio-body" />
              <span className="comic-studio-arm is-left" />
              <span className="comic-studio-arm is-right" />
              <span className="comic-studio-leg is-left" />
              <span className="comic-studio-leg is-right" />
              <span className="comic-studio-pedestal" />
            </div>
          </aside>

          <section className="comic-inventory-panel">
            <header><h2>AMOUNT</h2><strong>14/100</strong></header>
            <div className="comic-item-grid">
              {items.map((item, index) => (
                <button type="button" className={`comic-item-card${index === 1 ? " is-selected" : ""}`} key={item}>
                  <span className="comic-shirt-icon" />
                  <strong>{item}</strong>
                  {index === 1 ? <em>{"\u2713"}</em> : null}
                </button>
              ))}
            </div>
            <div className="comic-category-rail">
              <button type="button" className="is-active">{"\ud83d\udc55"}</button>
              <button type="button">{"\ud83d\udc56"}</button>
              <button type="button">{"\u26f0"}</button>
            </div>
          </section>
        </section>

        <nav className="comic-studio-tabs" aria-label="Studio tabs">
          <button type="button" className="is-active">{"\ud83d\udcbc"} INVENTORY</button>
          <button type="button">{"\ud83d\uddbc"} CREATION</button>
          <button type="button">{"\ud83d\udcca"} STATS</button>
        </nav>
      </main>
    </ComicShell>
  );
}
