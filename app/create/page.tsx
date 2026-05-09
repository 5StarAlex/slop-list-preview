import SlopPageShell from "../components/layout/SlopPageShell";
import NeonPanel from "../components/ui/NeonPanel";
import NeonButton from "../components/ui/NeonButton";

const talkedAbout = [
  ["Trending", "Clean Slop, No Witnesses", "The meme that broke the internet this week.", "12.4K"],
  ["News", "Vending Machine Boss", "Spotted in the wild: new dungeon encounter?", "8.7K"],
  ["Event", "Slop Arcade Open!", "New games. New leaderboard. Absolute chaos.", "7.1K"],
  ["Debate", "Pineapple on Slop?", "The eternal debate rages on once again.", "5.6K"],
  ["News", "New Challenger?", "Someone new is climbing the ranks...", "4.2K"],
] as const;

export default function CreatePage() {
  return (
    <SlopPageShell>
      <NeonPanel variant="purple" className="slop-talked-about-panel">
        <div className="slop-home-section-head">
          <h2>Most Talked About</h2>
        </div>
        <div className="slop-talked-about-grid">
          {talkedAbout.map(([tag, title, copy, score], index) => (
            <article key={title} className="slop-talked-card">
              <div className="slop-talked-card__image" aria-hidden="true">
                <span className="slop-talked-card__rank">{index + 1}</span>
                <span className="slop-talked-card__tag">{tag}</span>
              </div>
              <strong>{title}</strong>
              <p>{copy}</p>
              <span>★ {score}</span>
            </article>
          ))}
        </div>
      </NeonPanel>

      <div className="slop-post-layout">
        <NeonPanel variant="blue" className="slop-post-form-panel">
          <div className="slop-home-section-head">
            <div>
              <p className="slop-page-kicker">Post A New Entry</p>
              <h2>Drop a fresh listing into the board without leaving the rest of the site flow.</h2>
            </div>
            <NeonButton href="/rules" variant="purple">
              Rules
            </NeonButton>
          </div>

          <div className="slop-post-input-grid">
            <input className="slop-post-input" placeholder="Title..." />
            <input className="slop-post-input" placeholder="One-line hook..." />
          </div>
          <textarea className="slop-post-textarea" placeholder="Why does this deserve a spot in the rotation?" />
          <div className="slop-post-input-grid">
            <input className="slop-post-input" placeholder="Genre or vibe... (e.g. Meme, News, Rant)" />
            <input className="slop-post-input" placeholder="Image URL (or upload below)..." />
          </div>
          <label className="slop-upload-box">
            <span>Upload An Image</span>
            <small>PNG, JPG, GIF up to 10MB</small>
          </label>
          <div className="slop-post-actions">
            <NeonButton variant="pink">Submit Entry</NeonButton>
            <NeonButton variant="purple">Save Draft</NeonButton>
          </div>
        </NeonPanel>

        <NeonPanel variant="pink" className="slop-post-side-panel">
          <p className="slop-page-kicker">Make It Sloppy</p>
          <h2>Keep the hook fast, the angle obvious, and the screenshot loud enough to sell the bit.</h2>
          <div className="slop-vibe-row">
            <span className="slop-vibe-pill">Trending</span>
            <span className="slop-vibe-pill">Chaotic</span>
            <span className="slop-vibe-pill">Debate Bait</span>
          </div>
          <div className="slop-catalog-callout">
            <strong>Browse The Catalog</strong>
            <p>Not sure what fits? Check the catalog for inspo.</p>
            <NeonButton href="/catalog" variant="gold">
              Browse Catalog
            </NeonButton>
          </div>
        </NeonPanel>
      </div>
    </SlopPageShell>
  );
}
