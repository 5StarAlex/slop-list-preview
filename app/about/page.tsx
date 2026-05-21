import ComicShell from "../components/ComicShell";

const aboutSections = [
  {
    title: "WHAT IS SLOP LIST?",
    copy: "A comic-social board for ranking, collecting, posting, and celebrating the most unforgettable slop.",
    accent: "pink",
  },
  {
    title: "HOW COINS WORK",
    copy: "Earn stars through posts, games, challenges, and community momentum. Spend them on fits, effects, and profile flair.",
    accent: "yellow",
  },
  {
    title: "HOW RANKING WORKS",
    copy: "Posts, games, and slops climb when the community reacts. Loud taste, good timing, and consistency all matter.",
    accent: "blue",
  },
  {
    title: "COMMUNITY RULES",
    copy: "Keep it chaotic, not miserable. Be funny, be readable, and make the board better to look at.",
    accent: "purple",
  },
  {
    title: "FUTURE UPDATES",
    copy: "More game modes, richer shops, stronger creator tools, and a deeper slop identity system are on deck.",
    accent: "cyan",
  },
] as const;

export default function AboutPage() {
  return (
    <ComicShell className="comic-about-page">
      <main className="comic-about">
        <section className="comic-page-title">
          <p>ABOUT</p>
          <h1>THE SLOP LIST</h1>
          <span aria-hidden="true">{"\u2726"}</span>
        </section>

        <section className="comic-about-board">
          <header>
            <h2>FIELD GUIDE</h2>
            <p>The board runs on loud opinions, dumb commitment, and just enough structure to keep the chaos readable.</p>
          </header>

          <div className="comic-about-grid">
            {aboutSections.map((section, index) => (
              <article key={section.title} className={`comic-about-card is-${section.accent}`}>
                <span aria-hidden="true">{index + 1}</span>
                <h3>{section.title}</h3>
                <p>{section.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </ComicShell>
  );
}
