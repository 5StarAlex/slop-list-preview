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

const fallbackRows: Record<(typeof discoveryQueries)[number]["title"], Anime[]> = {
  "FRIEREN + SOFT FANTASY": [
    {
      mal_id: 52991,
      title: "Frieren: Beyond Journey's End",
      image: "https://cdn.myanimelist.net/images/anime/1015/138006l.jpg",
      score: 9.27,
      synopsis: "An elf mage travels after the hero's journey, learning what time, grief, and old bonds still mean.",
    },
    {
      mal_id: 54492,
      title: "The Apothecary Diaries",
      image: "https://cdn.myanimelist.net/images/anime/1708/138033l.jpg",
      score: 8.85,
      synopsis: "A sharp apothecary solves court mysteries with dry wit, poison knowledge, and a dangerously good poker face.",
    },
    {
      mal_id: 33352,
      title: "Violet Evergarden",
      image: "https://cdn.myanimelist.net/images/anime/1795/95088l.jpg",
      score: 8.69,
      synopsis: "A former soldier becomes a letter writer and slowly learns the language of love, loss, and memory.",
    },
    {
      mal_id: 35062,
      title: "The Ancient Magus' Bride",
      image: "https://cdn.myanimelist.net/images/anime/3/88476l.jpg",
      score: 8.05,
      synopsis: "A lonely girl enters a strange magical household filled with folklore, danger, and soft melancholy.",
    },
    {
      mal_id: 52701,
      title: "Delicious in Dungeon",
      image: "https://cdn.myanimelist.net/images/anime/1711/142478l.jpg",
      score: 8.59,
      synopsis: "A party crawls through a dungeon by cooking monsters, turning fantasy adventure into weird comfort food.",
    },
    {
      mal_id: 2966,
      title: "Spice and Wolf",
      image: "https://cdn.myanimelist.net/images/anime/5/59401l.jpg",
      score: 8.21,
      synopsis: "A merchant and a wolf deity wander through trade towns with romance, banter, and economic schemes.",
    },
    {
      mal_id: 25013,
      title: "Yona of the Dawn",
      image: "https://cdn.myanimelist.net/images/anime/9/64225l.jpg",
      score: 8.04,
      synopsis: "A sheltered princess escapes betrayal and slowly becomes the center of her own myth.",
    },
    {
      mal_id: 4081,
      title: "Natsume's Book of Friends",
      image: "https://cdn.myanimelist.net/images/anime/1681/108439l.jpg",
      score: 8.3,
      synopsis: "A gentle boy sees spirits and returns names from an inherited book, one quiet encounter at a time.",
    },
    {
      mal_id: 30123,
      title: "Snow White with the Red Hair",
      image: "https://cdn.myanimelist.net/images/anime/10/75764l.jpg",
      score: 7.76,
      synopsis: "A herbalist with bright red hair finds a new court, a new future, and a prince worth trusting.",
    },
    {
      mal_id: 51553,
      title: "Witch Hat Atelier",
      image: "https://cdn.myanimelist.net/images/anime/1726/155542l.jpg",
      score: 8.74,
      synopsis: "A girl who loves magic discovers its hidden rules and steps into a gorgeous witchcraft world.",
    },
  ],
  "ROMANCE COMEDY": [
    {
      mal_id: 37999,
      title: "Kaguya-sama: Love is War",
      image: "https://cdn.myanimelist.net/images/anime/1295/106551l.jpg",
      score: 8.4,
      synopsis: "Two elite student council rivals turn confession into psychological warfare.",
    },
    {
      mal_id: 55690,
      title: "The Dangers in My Heart Season 2",
      image: "https://cdn.myanimelist.net/images/anime/1643/138581l.jpg",
      score: 8.69,
      synopsis: "A shy boy and a bright model keep closing the distance in one of the sweetest modern romcoms.",
    },
    {
      mal_id: 42897,
      title: "Horimiya",
      image: "https://cdn.myanimelist.net/images/anime/1695/111486l.jpg",
      score: 8.18,
      synopsis: "Two classmates find each other's hidden sides and turn everyday high school life warm fast.",
    },
    {
      mal_id: 4224,
      title: "Toradora!",
      image: "https://cdn.myanimelist.net/images/anime/13/22128l.jpg",
      score: 8.04,
      synopsis: "A fake alliance between two prickly classmates becomes a classic romantic comedy mess.",
    },
    {
      mal_id: 48736,
      title: "My Dress-Up Darling",
      image: "https://cdn.myanimelist.net/images/anime/1179/119897l.jpg",
      score: 8.13,
      synopsis: "Cosplay, craft, and crush energy collide when two very different students become creative partners.",
    },
    {
      mal_id: 23289,
      title: "Monthly Girls' Nozaki-kun",
      image: "https://cdn.myanimelist.net/images/anime/5/66083l.jpg",
      score: 7.81,
      synopsis: "A confession goes sideways into manga assistant work and perfect deadpan comedy.",
    },
    {
      mal_id: 35968,
      title: "Wotakoi: Love is Hard for Otaku",
      image: "https://cdn.myanimelist.net/images/anime/1864/93518l.jpg",
      score: 7.92,
      synopsis: "Office romance for nerds who would rather be gaming, reading, and dodging emotional sincerity.",
    },
    {
      mal_id: 35860,
      title: "Teasing Master Takagi-san",
      image: "https://cdn.myanimelist.net/images/anime/1591/95091l.jpg",
      score: 7.67,
      synopsis: "A girl keeps teasing the boy beside her, and every tiny prank is basically a love letter.",
    },
    {
      mal_id: 7054,
      title: "Maid Sama!",
      image: "https://cdn.myanimelist.net/images/anime/6/25254l.jpg",
      score: 7.99,
      synopsis: "A strict student council president hides a cafe job, until the school's popular boy finds out.",
    },
    {
      mal_id: 55866,
      title: "A Sign of Affection",
      image: "https://cdn.myanimelist.net/images/anime/1478/140828l.jpg",
      score: 8.2,
      synopsis: "A soft university romance about communication, curiosity, and letting someone into your world.",
    },
  ],
  "TOP ANIME": [
    {
      mal_id: 52991,
      title: "Frieren: Beyond Journey's End",
      image: "https://cdn.myanimelist.net/images/anime/1015/138006l.jpg",
      score: 9.27,
      synopsis: "A reflective fantasy journey after the final battle, built around memory and connection.",
    },
    {
      mal_id: 43608,
      title: "Kaguya-sama: Love is War -Ultra Romantic-",
      image: "https://cdn.myanimelist.net/images/anime/1160/122627l.jpg",
      score: 8.95,
      synopsis: "The student council romance war reaches peak confession chaos.",
    },
    {
      mal_id: 5114,
      title: "Fullmetal Alchemist: Brotherhood",
      image: "https://cdn.myanimelist.net/images/anime/1208/94745l.jpg",
      score: 9.11,
      synopsis: "Two brothers chase restoration through alchemy, war, conspiracy, and sacrifice.",
    },
    {
      mal_id: 9253,
      title: "Steins;Gate",
      image: "https://cdn.myanimelist.net/images/anime/1935/127974l.jpg",
      score: 9.07,
      synopsis: "Time travel starts as a joke and becomes a devastating thriller about consequence.",
    },
    {
      mal_id: 37987,
      title: "Violet Evergarden: The Movie",
      image: "https://cdn.myanimelist.net/images/anime/1825/110716l.jpg",
      score: 8.83,
      synopsis: "Violet's search for feeling and closure becomes a sweeping final letter.",
    },
    {
      mal_id: 28851,
      title: "A Silent Voice",
      image: "https://cdn.myanimelist.net/images/anime/1122/96435l.jpg",
      score: 8.93,
      synopsis: "A former bully tries to face the girl he hurt and the life he almost lost.",
    },
    {
      mal_id: 42938,
      title: "Fruits Basket: The Final Season",
      image: "https://cdn.myanimelist.net/images/anime/1085/114792l.jpg",
      score: 8.93,
      synopsis: "The zodiac curse reaches its emotional finish with family trauma and chosen love.",
    },
    {
      mal_id: 50172,
      title: "Mob Psycho 100 III",
      image: "https://cdn.myanimelist.net/images/anime/1228/125011l.jpg",
      score: 8.72,
      synopsis: "A psychic boy faces his feelings with surreal action and huge emotional payoff.",
    },
    {
      mal_id: 52034,
      title: "[Oshi No Ko]",
      image: "https://cdn.myanimelist.net/images/anime/1812/134736l.jpg",
      score: 8.53,
      synopsis: "A pop-idol mystery drama about fame, performance, revenge, and reinvention.",
    },
    {
      mal_id: 47917,
      title: "Bocchi the Rock!",
      image: "https://cdn.myanimelist.net/images/anime/1448/127956l.jpg",
      score: 8.73,
      synopsis: "A socially anxious guitarist joins a band and turns panic into extremely funny music.",
    },
  ],
};

function mapAnime(item: JikanAnime): Anime {
  return {
    mal_id: item.mal_id,
    title: item.title_english || item.title,
    image: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || "",
    score: item.score,
    synopsis: item.synopsis,
  };
}

function uniqueAnime(items: Anime[]) {
  const seen = new Set<number>();

  return items.filter((item) => {
    if (seen.has(item.mal_id)) {
      return false;
    }

    seen.add(item.mal_id);
    return true;
  });
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
  const [rows, setRows] = useState<Record<string, Anime[]>>(fallbackRows);
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
      discoveryQueries.map(async (query) => {
        try {
          const response = await fetch(query.url);
          const payload = await response.json();
          const liveItems = Array.isArray(payload.data) ? payload.data.map(mapAnime) : [];
          return [query.title, uniqueAnime([...fallbackRows[query.title], ...liveItems]).slice(0, 12)] as const;
        } catch {
          return [query.title, fallbackRows[query.title]] as const;
        }
      }),
    )
      .then((results) => {
        if (!isMounted) {
          return;
        }

        setRows({ ...fallbackRows, ...Object.fromEntries(results) });
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
