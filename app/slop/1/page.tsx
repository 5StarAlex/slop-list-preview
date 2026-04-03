export default function SlopDetailPage() {
  return (
    <div className="page-stack">
      <section className="section-heading">
        <div className="stack-sm">
          <span className="section-kicker">Detail View</span>
          <h1 className="section-title">Akiba Maid War</h1>
          <p className="section-copy">
            The focused detail page keeps the same glossy system while trimming
            away unnecessary interactivity.
          </p>
        </div>
      </section>

      <section className="content-grid">
        <article className="spotlight-card">
          <div className="spotlight-cover" />
          <div className="stack-md">
            <p className="section-copy">
              A maelstrom of maid cafe politics, dead-serious action framing, and
              absurd tonal pivots that somehow become the whole appeal.
            </p>
            <div className="tag-row">
              <span className="tag">12 Episodes</span>
              <span className="tag">P.A. Works</span>
              <span className="tag">Action Comedy</span>
            </div>
          </div>
        </article>

        <aside className="glass-panel stack-lg">
          <div className="stack-sm">
            <h2 className="card-title">Why it landed here</h2>
            <ul className="plain-list">
              <li>Ridiculously sharp visual identity.</li>
              <li>Every episode escalates in the funniest possible direction.</li>
              <li>Fits the site because it is both stylish and gloriously messy.</li>
            </ul>
          </div>

          <div className="stack-sm">
            <h2 className="card-title">Community meter</h2>
            <div className="meter-row">
              <div className="meter-chip">
                <strong>7.3</strong>
                <span className="muted-copy">MAL score</span>
              </div>
              <div className="meter-chip">
                <strong>A Tier</strong>
                <span className="muted-copy">This week&apos;s ranking</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
