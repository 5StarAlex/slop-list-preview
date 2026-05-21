"use client";

import Image from "next/image";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import ComicShell from "../components/ComicShell";

type Anime = {
  mal_id: number;
  title: string;
  image: string;
  score?: number;
  synopsis?: string;
};

type JikanAnime = {
  mal_id: number;
  title: string;
  title_english?: string;
  score?: number;
  synopsis?: string;
  images?: {
    jpg?: {
      image_url?: string;
      large_image_url?: string;
    };
  };
};

type AnimePost = {
  id: number;
  animeId: number;
  body: string;
};

const WATCHLIST_KEY = "slop-list-watchlist";
const RATINGS_KEY = "slop-list-anime-ratings";
const TOP_SLOP_KEY = "slop-list-top-slop-votes";
const ANIME_POSTS_KEY = "slop-list-anime-posts";
const WATCHLIST_COLLAPSED_LIMIT = 6;

const discoveryQueries = [
  {
    title: "FRIEREN + SOFT FANTASY",
    url: "https://api.jikan.moe/v4/anime?q=frieren&limit=12",
    empty: "Loading Frieren-style fantasy picks...",
  },
  {
    title: "ROMANCE COMEDY",
    url: "https://api.jikan.moe/v4/anime?genres=4,22&order_by=score&sort=desc&limit=12",
    empty: "Loading romance comedy shows...",
  },
  {
    title: "TOP ANIME",
    url: "https://api.jikan.moe/v4/top/anime?limit=12",
    empty: "Loading top anime from Jikan...",
  },
] as const;

function mapAnime(item: JikanAnime): Anime {
  return {
    mal_id: item.mal_id,
    title: item.title_english || item.title,
    image: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || "",
    score: item.score,
    synopsis: item.synopsis,
  };
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export default function CatalogPage() {
  const [rows, setRows] = useState<Record<string, Anime[]>>({});
  const [watchlist, setWatchlist] = useState<Anime[]>(() => readJson(WATCHLIST_KEY, []));
  const [ratings, setRatings] = useState<Record<string, number>>(() => readJson(RATINGS_KEY, {}));
  const [topSlopVotes, setTopSlopVotes] = useState<Record<string, number>>(() => readJson(TOP_SLOP_KEY, {}));
  const [animePosts, setAnimePosts] = useState<AnimePost[]>(() => readJson(ANIME_POSTS_KEY, []));
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [watchlistExpanded, setWatchlistExpanded] = useState(false);
  const [postDraft, setPostDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all(
      discoveryQueries.map((query) =>
        fetch(query.url)
          .then((response) => response.json())
          .then((payload) => [query.title, (payload.data ?? []).map(mapAnime)] as const)
          .catch(() => [query.title, []] as const),
      ),
    )
      .then((results) => {
        if (!isMounted) {
          return;
        }

        setRows(Object.fromEntries(results));
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

  const watchlistPreview = watchlistExpanded ? watchlist : watchlist.slice(0, WATCHLIST_COLLAPSED_LIMIT);
  const selectedPosts = useMemo(
    () => animePosts.filter((post) => post.animeId === selectedAnime?.mal_id),
    [animePosts, selectedAnime?.mal_id],
  );

  const persistWatchlist = (next: Anime[]) => {
    setWatchlist(next);
    writeJson(WATCHLIST_KEY, next);
  };

  const addToWatchlist = (anime: Anime) => {
    if (watchlist.some((item) => item.mal_id === anime.mal_id)) {
      return;
    }

    persistWatchlist([anime, ...watchlist]);
  };

  const removeFromWatchlist = (anime: Anime) => {
    persistWatchlist(watchlist.filter((item) => item.mal_id !== anime.mal_id));
  };

  const rateAnime = (anime: Anime, rating: number) => {
    const next = { ...ratings, [anime.mal_id]: rating };
    setRatings(next);
    writeJson(RATINGS_KEY, next);
  };

  const voteTopSlop = (anime: Anime) => {
    const next = { ...topSlopVotes, [anime.mal_id]: (topSlopVotes[anime.mal_id] ?? 0) + 1 };
    setTopSlopVotes(next);
    writeJson(TOP_SLOP_KEY, next);
  };

  const submitAnimePost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedAnime || !postDraft.trim()) {
      return;
    }

    const next = [
      { id: Date.now(), animeId: selectedAnime.mal_id, body: postDraft.trim() },
      ...animePosts,
    ];
    setAnimePosts(next);
    writeJson(ANIME_POSTS_KEY, next);
    setPostDraft("");
  };

  return (
    <ComicShell className="comic-catalog-page">
      <main className="comic-catalog">
        <CatalogRow
          title="MY WATCH LIST"
          items={watchlistPreview}
          emptyText="Add anime from the shelves below and they will show up here."
          onSelect={setSelectedAnime}
          ratings={ratings}
          topSlopVotes={topSlopVotes}
        />
        {watchlist.length > WATCHLIST_COLLAPSED_LIMIT ? (
          <button type="button" className="comic-watchlist-expand" onClick={() => setWatchlistExpanded((current) => !current)}>
            {watchlistExpanded ? "Show Less" : `+ Show ${watchlist.length - WATCHLIST_COLLAPSED_LIMIT} More`}
          </button>
        ) : null}

        {discoveryQueries.map((query) => (
          <CatalogRow
            key={query.title}
            title={query.title}
            items={rows[query.title] ?? []}
            emptyText={isLoading ? query.empty : "No shows loaded for this shelf."}
            onSelect={setSelectedAnime}
            ratings={ratings}
            topSlopVotes={topSlopVotes}
          />
        ))}

        {selectedAnime ? (
          <AnimeDetailPanel
            anime={selectedAnime}
            rating={ratings[selectedAnime.mal_id] ?? 0}
            topSlopVotes={topSlopVotes[selectedAnime.mal_id] ?? 0}
            isInWatchlist={watchlist.some((item) => item.mal_id === selectedAnime.mal_id)}
            posts={selectedPosts}
            postDraft={postDraft}
            onPostDraftChange={setPostDraft}
            onClose={() => setSelectedAnime(null)}
            onRate={(rating) => rateAnime(selectedAnime, rating)}
            onVote={() => voteTopSlop(selectedAnime)}
            onAdd={() => addToWatchlist(selectedAnime)}
            onRemove={() => removeFromWatchlist(selectedAnime)}
            onSubmitPost={submitAnimePost}
          />
        ) : null}
      </main>
    </ComicShell>
  );
}

function CatalogRow({
  title,
  items,
  emptyText,
  onSelect,
  ratings,
  topSlopVotes,
}: {
  title: string;
  items: Anime[];
  emptyText: string;
  onSelect: (anime: Anime) => void;
  ratings: Record<string, number>;
  topSlopVotes: Record<string, number>;
}) {
  return (
    <section className={`comic-catalog-section${items.length === 0 ? " is-empty" : ""}`}>
      <header>
        <h2>{title}</h2>
        <a href="https://api.jikan.moe/v4/top/anime?limit=12" target="_blank" rel="noreferrer">
          Jikan API <span aria-hidden="true">{"\u203a"}</span>
        </a>
      </header>
      <div className="comic-catalog-row">
        {items.length === 0 ? (
          <p className="comic-empty-line">{emptyText}</p>
        ) : (
          items.map((anime) => (
            <button key={anime.mal_id} type="button" className="comic-catalog-card" onClick={() => onSelect(anime)}>
              <span className="comic-catalog-thumb is-live">
                {anime.image ? <Image src={anime.image} alt={anime.title} fill unoptimized sizes="220px" /> : null}
              </span>
              <span className="comic-catalog-card-shade" aria-hidden="true" />
              <span className="comic-catalog-card-copy">
                <strong>{anime.title}</strong>
                <em>
                  {ratings[anime.mal_id] ? `Your ${ratings[anime.mal_id]}/10` : anime.score ? `MAL ${anime.score}` : "Unrated"}
                  {topSlopVotes[anime.mal_id] ? ` - Top Slop ${topSlopVotes[anime.mal_id]}` : ""}
                </em>
              </span>
            </button>
          ))
        )}
      </div>
    </section>
  );
}

function AnimeDetailPanel({
  anime,
  rating,
  topSlopVotes,
  isInWatchlist,
  posts,
  postDraft,
  onPostDraftChange,
  onClose,
  onRate,
  onVote,
  onAdd,
  onRemove,
  onSubmitPost,
}: {
  anime: Anime;
  rating: number;
  topSlopVotes: number;
  isInWatchlist: boolean;
  posts: AnimePost[];
  postDraft: string;
  onPostDraftChange: (value: string) => void;
  onClose: () => void;
  onRate: (rating: number) => void;
  onVote: () => void;
  onAdd: () => void;
  onRemove: () => void;
  onSubmitPost: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <aside className="comic-anime-panel" aria-label={`${anime.title} details`}>
      <button type="button" className="comic-anime-panel-close" onClick={onClose} aria-label="Close anime details">
        {"\u00d7"}
      </button>
      <div className="comic-anime-panel-poster">
        {anime.image ? <Image src={anime.image} alt={anime.title} fill unoptimized sizes="320px" /> : null}
      </div>
      <div className="comic-anime-panel-copy">
        <p>SELECTED SLOP</p>
        <h2>{anime.title}</h2>
        <span>MAL {anime.score ?? "N/A"} - Top Slop votes {topSlopVotes}</span>
        {anime.synopsis ? <p>{anime.synopsis.slice(0, 240)}...</p> : null}
        <div className="comic-anime-rating" aria-label="Rate anime">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <button key={value} type="button" className={rating === value ? "is-active" : ""} onClick={() => onRate(value)}>
              {value}
            </button>
          ))}
        </div>
        <div className="comic-anime-actions">
          <button type="button" onClick={isInWatchlist ? onRemove : onAdd}>
            {isInWatchlist ? "Remove From List" : "Add To List"}
          </button>
          <button type="button" onClick={onVote}>Vote Top Slop</button>
        </div>
        <form className="comic-anime-post-form" onSubmit={onSubmitPost}>
          <label>
            <span>Post about this show</span>
            <textarea value={postDraft} onChange={(event) => onPostDraftChange(event.target.value)} placeholder="Drop your take..." />
          </label>
          <button type="submit">Post</button>
        </form>
        <div className="comic-anime-posts">
          {posts.length === 0 ? <p>No posts yet.</p> : posts.map((post) => <p key={post.id}>{post.body}</p>)}
        </div>
      </div>
    </aside>
  );
}
