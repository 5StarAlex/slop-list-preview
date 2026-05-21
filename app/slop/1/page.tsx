import ComicShell from "../../components/ComicShell";

const stats = [
  ["12", "Episodes"],
  ["P.A. Works", "Studio"],
  ["A Tier", "This Week"],
] as const;

const reasons = [
  "Ridiculously sharp visual identity.",
  "Every episode escalates in the funniest possible direction.",
  "Stylish, messy, and exactly the kind of thing the board should argue about.",
] as const;

export default function SlopDetailPage() {
  return (
    <ComicShell className="comic-detail-page">
      <main className="comic-detail">
        <section className="comic-page-title">
          <p>DETAIL VIEW</p>
          <h1>AKIBA MAID WAR</h1>
          <span aria-hidden="true">{"\u2605"}</span>
        </section>

        <section className="comic-detail-grid">
          <article className="comic-detail-spotlight">
            <div className="comic-detail-poster">
              <span>AKIBA</span>
              <strong>MAID WAR</strong>
            </div>
            <div className="comic-detail-copy">
              <mark>Action Comedy</mark>
              <p>
                A maelstrom of maid cafe politics, dead-serious action framing, and absurd tonal pivots that somehow become the whole appeal.
              </p>
              <div className="comic-detail-stats">
                {stats.map(([value, label]) => (
                  <span key={label}>
                    <strong>{value}</strong>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <aside className="comic-detail-panel">
            <h2>WHY IT LANDED HERE</h2>
            <ul>
              {reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
            <div className="comic-detail-meter">
              <span>
                <strong>7.3</strong>
                MAL Score
              </span>
              <span>
                <strong>{"\u2605"} 15,230</strong>
                Community Heat
              </span>
            </div>
          </aside>
        </section>
      </main>
    </ComicShell>
  );
}
