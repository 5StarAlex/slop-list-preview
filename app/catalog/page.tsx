"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ComicShell from "../components/ComicShell";

type Anime = {
  mal_id: number;
  title: string;
  image: string;
  score?: number;
};

type JikanAnime = {
  mal_id: number;
  title: string;
  score?: number;
  images?: {
    jpg?: {
      image_url?: string;
    };
  };
};

const WATCHLIST_KEY = "slop-list-watchlist";

function mapAnime(item: JikanAnime): Anime {
  return {
    mal_id: item.mal_id,
    title: item.title,
    image: item.images?.jpg?.image_url ?? "",
    score: item.score,
  };
}

function readWatchlist() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(WATCHLIST_KEY);
    return raw ? (JSON.parse(raw) as Anime[]) : [];
  } catch {
    window.localStorage.removeItem(WATCHLIST_KEY);
    return [];
  }
}

export default function CatalogPage() {
  const [trending, setTrending] = useState<Anime[]>([]);
  const [narutoResults, setNarutoResults] = useState<Anime[]>([]);
  const [watchlist, setWatchlist] = useState<Anime[]>(readWatchlist);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      fetch("https://api.jikan.moe/v4/anime?q=naruto&limit=12").then((response) => response.json()),
      fetch("https://api.jikan.moe/v4/top/anime?limit=12").then((response) => response.json()),
    ])
      .then(([naruto, top]) => {
        if (!isMounted) {
          return;
        }

        setNarutoResults((naruto.data ?? []).map(mapAnime));
        setTrending((top.data ?? []).map(mapAnime));
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setNarutoResults([]);
        setTrending([]);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const addToWatchlist = (anime: Anime) => {
    const next = watchlist.some((item) => item.mal_id === anime.mal_id)
      ? watchlist
      : [anime, ...watchlist].slice(0, 50);

    setWatchlist(next);
    window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
  };

  const removeFromWatchlist = (anime: Anime) => {
    const next = watchlist.filter((item) => item.mal_id !== anime.mal_id);
    setWatchlist(next);
    window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
  };

  return (
    <ComicShell className="comic-catalog-page">
      <main className="comic-catalog">
        <CatalogRow
          title="MY WATCH LIST"
          items={watchlist}
          emptyText="Add anime from the rows below and they will show up here."
          actionLabel="Remove"
          onAction={removeFromWatchlist}
        />
        <CatalogRow
          title="NARUTO SEARCH"
          items={narutoResults}
          emptyText={isLoading ? "Loading anime from Jikan..." : "No Naruto results loaded."}
          actionLabel="Add"
          onAction={addToWatchlist}
          watchlist={watchlist}
        />
        <CatalogRow
          title="TRENDING ANIME"
          items={trending}
          emptyText={isLoading ? "Loading top anime from Jikan..." : "No trending anime loaded."}
          actionLabel="Add"
          onAction={addToWatchlist}
          watchlist={watchlist}
        />
      </main>
    </ComicShell>
  );
}

function CatalogRow({
  title,
  items,
  emptyText,
  actionLabel,
  onAction,
  watchlist = [],
}: {
  title: string;
  items: Anime[];
  emptyText: string;
  actionLabel: string;
  onAction: (anime: Anime) => void;
  watchlist?: Anime[];
}) {
  return (
    <section className={`comic-catalog-section${items.length === 0 ? " is-empty" : ""}`}>
      <header>
        <h2>{title}</h2>
        <a href="https://api.jikan.moe/v4/anime?q=naruto" target="_blank" rel="noreferrer">
          Jikan API <span aria-hidden="true">{"\u203a"}</span>
        </a>
      </header>
      <div className="comic-catalog-row">
        {items.length === 0 ? (
          <p className="comic-empty-line">{emptyText}</p>
        ) : (
          items.map((anime) => {
            const alreadyAdded = watchlist.some((item) => item.mal_id === anime.mal_id);

            return (
              <article key={anime.mal_id} className="comic-catalog-card">
                <div className="comic-catalog-thumb is-live">
                  {anime.image ? (
                    <Image src={anime.image} alt={anime.title} fill unoptimized sizes="180px" />
                  ) : null}
                </div>
                <strong>{anime.title}</strong>
                <span>{anime.score ? `Score ${anime.score}` : "Anime"}</span>
                <button type="button" onClick={() => onAction(anime)} disabled={actionLabel === "Add" && alreadyAdded}>
                  {alreadyAdded && actionLabel === "Add" ? "Added" : actionLabel}
                </button>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
