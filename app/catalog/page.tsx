import type { ReactNode } from "react";

import ComicShell from "../components/ComicShell";

const springAnime = [
  "Tongari Boushi no Atelier",
  "Re:Zero kara Hajimeru Isekai Seikatsu 4th Season",
  "Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e 4th Season: 2-nensei-hen 1 Gakki",
  "Tensei shitara Slime Datta Ken 4th Season",
  "Yomi no Tsugai",
  "Ao no Exorcist: Yosuga-hen",
] as const;

const episodeVideos = ["Episode 13", "Episode 1", "Episode 26", "Episode 167", "Episode 12", "Episode 1", "Episode 5"] as const;

export default function CatalogPage() {
  return (
    <ComicShell className="comic-catalog-page">
      <main className="comic-catalog">
        <CatalogSection title="MY WATCHED TOPICS" empty action>
          <p className="comic-empty-line">No watched topics found.</p>
        </CatalogSection>

        <CatalogSection title="SPRING 2026 ANIME" action arrow>
          <div className="comic-catalog-row">
            {springAnime.map((title, index) => (
              <article key={title} className="comic-catalog-card">
                <div className={`comic-catalog-thumb tone-${index + 1}`} />
                <strong>{title}</strong>
                <span />
              </article>
            ))}
          </div>
        </CatalogSection>

        <CatalogSection title="LATEST UPDATED EPISODE VIDEOS" action arrow>
          <div className="comic-catalog-row is-videos">
            {episodeVideos.map((title, index) => (
              <article key={`${title}-${index}`} className="comic-catalog-card">
                <div className={`comic-catalog-thumb tone-${(index % 6) + 1}`} />
                <strong>{title} <span aria-hidden="true">{"\u2655"}</span></strong>
                <span />
              </article>
            ))}
          </div>
        </CatalogSection>
      </main>
    </ComicShell>
  );
}

function CatalogSection({
  title,
  children,
  empty = false,
  action = false,
  arrow = false,
}: {
  title: string;
  children: ReactNode;
  empty?: boolean;
  action?: boolean;
  arrow?: boolean;
}) {
  return (
    <section className={`comic-catalog-section${empty ? " is-empty" : ""}`}>
      <header>
        <h2>{title}</h2>
        {action ? <a href="#">View More <span aria-hidden="true">{"\u203a"}</span></a> : null}
      </header>
      {children}
      {arrow ? <button type="button" className="comic-row-arrow" aria-label={`Scroll ${title}`}>{"\u203a"}</button> : null}
    </section>
  );
}
