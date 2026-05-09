import SlopPageShell from "../components/layout/SlopPageShell";
import NeonPanel from "../components/ui/NeonPanel";

const aboutSections = [
  ["What Is Slop List?", "A neon arcade-social platform for ranking, collecting, posting, and clowning on the most unforgettable slop."],
  ["How Coins Work", "You earn coins through participation, games, challenges, and community momentum. Spend them on cosmetics, effects, and fits."],
  ["How Ranking Works", "Posts, games, and slops rise when the community engages. Hot takes, meme energy, and consistency all matter."],
  ["Community Rules", "Keep it chaotic, not miserable. Be funny, be readable, and don’t make the board worse to look at."],
  ["Future Updates", "More games, richer shops, better creator tools, and a stronger slop identity system are all on deck."],
] as const;

export default function AboutPage() {
  return (
    <SlopPageShell>
      <div className="slop-page-heading">
        <div>
          <p className="slop-page-kicker">About</p>
          <h1 className="slop-page-title">The Slop List</h1>
          <p className="slop-page-copy">The board runs on loud opinions, dumb commitment, and just enough structure to keep the chaos readable.</p>
        </div>
      </div>

      <div className="slop-about-grid">
        {aboutSections.map(([title, copy], index) => (
          <NeonPanel key={title} variant={index % 2 === 0 ? "purple" : "blue"} className="slop-about-card">
            <span className="slop-about-icon" aria-hidden="true">
              ★
            </span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </NeonPanel>
        ))}
      </div>
    </SlopPageShell>
  );
}
