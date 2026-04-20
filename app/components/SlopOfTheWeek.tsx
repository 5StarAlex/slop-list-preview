"use client";

import Image from "next/image";
import { CSSProperties, useEffect, useState } from "react";

const emojiRanks = [
  { emoji: "\u{2639}\u{FE0F}", label: "Frown Face" },
  { emoji: "\u{1F479}", label: "Demon" },
  { emoji: "\u{1F922}", label: "Sick" },
  { emoji: "\u{1F610}", label: "Straight Face" },
  { emoji: "\u{1F624}", label: "Angry Steam" },
  { emoji: "\u{1F629}", label: "Groan" },
  { emoji: "\u{1F635}", label: "Swirly Face" },
  { emoji: "\u{1F975}", label: "Flustered" },
];

const transitionMs = 520;

type SlopEntry = {
  title: string;
  image: string;
  fallbackImage: string;
  alt: string;
  description: string;
  meta: string[];
};

type Direction = "prev" | "next";

type PosterRenderItem = {
  entry: SlopEntry;
  slot: "left" | "center" | "right" | "hidden-left" | "hidden-right";
  key: string;
  animationClass?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const slopEntries: SlopEntry[] = [
  {
    title: "RWBY",
    image: "https://m.media-amazon.com/images/M/MV5BOGM4MTQwMDQtMDIxZC00MTQ3LWEyYWQtOTI5Y2E2MDA5OTQ0XkEyXkFqcGc@._V1_.jpg",
    fallbackImage:
      "https://static.wikia.nocookie.net/voiceacting/images/3/36/More_Than_a_Married_Couple%2C_But_Not_Lovers.jpg/revision/latest?cb=20221022013500",
    alt: "RWBY promotional art",
    description:
      "A flashy action-fantasy series about four huntresses fighting monsters, surviving anime-level drama, and carrying a whole lot of stylish weapon nonsense on pure momentum.",
    meta: ["MAL Rating: 7.59", "Action Fantasy", "9 Volumes"],
  },
  {
    title: "More Than a Married Couple, But Not Lovers",
    image:
      "https://a.storyblok.com/f/178900/720x1019/92a2df354f/f8bb861fa9fb82fb3d5f8887c36668231651454540_main.jpg/m/filters:quality(95)format(webp)",
    fallbackImage:
      "https://static.wikia.nocookie.net/voiceacting/images/3/36/More_Than_a_Married_Couple%2C_But_Not_Lovers.jpg/revision/latest?cb=20221022013500",
    alt: "More Than a Married Couple, But Not Lovers poster",
    description:
      "A 2022 romantic comedy anime where high schoolers Jiro Yakuin and Akari Watanabe are forced to live together for a marriage training project, then slowly catch real feelings while trying to earn enough points to swap partners.",
    meta: ["MAL Rating: 7.61", "Rom-Com", "12 Episodes"],
  },
  {
    title: "Isekai Quartet",
    image:
      "https://image.tmdb.org/t/p/original/28p3FQfoy30IitJiWBYw0Guvjt.jpg",
    fallbackImage:
      "https://static.wikia.nocookie.net/isekai-quartet/images/d/d3/Top_Main_-_square_edges.png/revision/latest?cb=20210707231454",
    alt: "Isekai Quartet cover art",
    description:
      "A chibi crossover comedy that throws the casts of KonoSuba, Overlord, Re:Zero, and The Saga of Tanya the Evil into one school and lets the chaos do the rest.",
    meta: ["MAL Rating: 7.37", "Comedy", "24 Episodes"],
  },
];

function normalizeIndex(index: number) {
  return (index + slopEntries.length) % slopEntries.length;
}

function PosterCard({
  entry,
  slot,
  animationClass,
  onClick,
  disabled = false,
}: {
  entry: SlopEntry;
  slot: PosterRenderItem["slot"];
  animationClass?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const [coverSrc, setCoverSrc] = useState(entry.image);

  return (
    <button
      type="button"
      className={`slop-poster-card slop-poster-${slot}${slot !== "center" ? " is-side" : ""}${
        animationClass ? ` ${animationClass}` : ""
      }`}
      onClick={onClick}
      disabled={disabled || !onClick}
      aria-label={onClick ? `Show ${entry.title}` : `${entry.title} poster`}
      aria-current={slot === "center" ? "true" : undefined}
    >
      <div className="image-frame slop-poster-frame hover-grow-panel">
        {slot === "center" ? (
          <span className="crown-badge" aria-hidden="true">
            {"\u{1F451}"}
          </span>
        ) : null}
        <Image
          src={coverSrc}
          alt={entry.alt}
          className="floating-cover"
          width={720}
          height={1019}
          unoptimized
          onError={() => setCoverSrc(entry.fallbackImage)}
        />
      </div>
    </button>
  );
}

function Posters({
  activeIndex,
  motionDirection,
  onCycle,
  isAnimating,
}: {
  activeIndex: number;
  motionDirection: Direction | null;
  onCycle: (direction: Direction) => void;
  isAnimating: boolean;
}) {
  const transitionStyle = {
    "--slop-transition-ms": `${transitionMs}ms`,
  } as CSSProperties;

  const previousIndex = normalizeIndex(activeIndex - 1);
  const nextIndex = normalizeIndex(activeIndex + 1);
  const farLeftIndex = normalizeIndex(activeIndex - 2);
  const farRightIndex = normalizeIndex(activeIndex + 2);

  const posterItems: PosterRenderItem[] =
    motionDirection === "next"
      ? [
          {
            entry: slopEntries[previousIndex],
            slot: "hidden-left",
            key: `out-left-${previousIndex}`,
            animationClass: "animate-next-out-left",
            disabled: true,
          },
          {
            entry: slopEntries[activeIndex],
            slot: "left",
            key: `move-left-${activeIndex}`,
            animationClass: "animate-next-to-left",
            disabled: true,
          },
          {
            entry: slopEntries[nextIndex],
            slot: "center",
            key: `move-center-${nextIndex}`,
            animationClass: "animate-next-to-center",
            disabled: true,
          },
          {
            entry: slopEntries[farRightIndex],
            slot: "right",
            key: `enter-right-${farRightIndex}`,
            animationClass: "animate-next-in-right",
            disabled: true,
          },
        ]
      : motionDirection === "prev"
        ? [
            {
              entry: slopEntries[farLeftIndex],
              slot: "left",
              key: `enter-left-${farLeftIndex}`,
              animationClass: "animate-prev-in-left",
              disabled: true,
            },
            {
              entry: slopEntries[previousIndex],
              slot: "center",
              key: `move-center-${previousIndex}`,
              animationClass: "animate-prev-to-center",
              disabled: true,
            },
            {
              entry: slopEntries[activeIndex],
              slot: "right",
              key: `move-right-${activeIndex}`,
              animationClass: "animate-prev-to-right",
              disabled: true,
            },
            {
              entry: slopEntries[nextIndex],
              slot: "hidden-right",
              key: `out-right-${nextIndex}`,
              animationClass: "animate-prev-out-right",
              disabled: true,
            },
          ]
        : [
            {
              entry: slopEntries[previousIndex],
              slot: "left",
              key: `rest-left-${previousIndex}`,
              onClick: () => onCycle("prev"),
            },
            {
              entry: slopEntries[activeIndex],
              slot: "center",
              key: `rest-center-${activeIndex}`,
            },
            {
              entry: slopEntries[nextIndex],
              slot: "right",
              key: `rest-right-${nextIndex}`,
              onClick: () => onCycle("next"),
            },
          ];

  return (
    <div className="slop-poster-window" aria-live="polite">
      <div
        className={`slop-poster-track${motionDirection ? ` is-moving-${motionDirection}` : ""}`}
        style={transitionStyle}
      >
        {posterItems.map((item) => (
          <PosterCard
            key={item.key}
            entry={item.entry}
            slot={item.slot}
            animationClass={item.animationClass}
            onClick={item.onClick}
            disabled={item.disabled || isAnimating}
          />
        ))}
      </div>
    </div>
  );
}

function DescriptionCarousel({
  activeIndex,
  motionDirection,
}: {
  activeIndex: number;
  motionDirection: Direction | null;
}) {
  const transitionStyle = {
    "--slop-transition-ms": `${transitionMs}ms`,
  } as CSSProperties;

  const currentEntry = slopEntries[activeIndex];
  const incomingEntry =
    motionDirection === "next"
      ? slopEntries[normalizeIndex(activeIndex + 1)]
      : motionDirection === "prev"
        ? slopEntries[normalizeIndex(activeIndex - 1)]
        : null;

  return (
    <div className="slop-description-window">
      <div
        className={`slop-description-track${motionDirection ? ` is-moving-${motionDirection}` : ""}`}
        style={transitionStyle}
      >
        <article
          className={`slop-description-panel is-current${
            motionDirection ? ` animate-description-out-${motionDirection}` : ""
          }`}
          aria-hidden={motionDirection ? "true" : undefined}
        >
          <h2 className="slop-name slop-poster-title">{currentEntry.title}</h2>
          <p className="slop-copy">{currentEntry.description}</p>
        </article>

        {incomingEntry ? (
          <article
            className={`slop-description-panel is-incoming${
              motionDirection ? ` animate-description-in-${motionDirection}` : ""
            }`}
          >
            <h2 className="slop-name slop-poster-title">{incomingEntry.title}</h2>
            <p className="slop-copy">{incomingEntry.description}</p>
          </article>
        ) : null}
      </div>
    </div>
  );
}

export default function SlopOfTheWeek() {
  const [selected, setSelected] = useState(emojiRanks[0]);
  const [comment, setComment] = useState("");
  const [posted, setPosted] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [motionDirection, setMotionDirection] = useState<Direction | null>(null);

  const activeEntry = slopEntries[activeIndex];

  const cycle = (direction: Direction) => {
    if (motionDirection) {
      return;
    }

    setMotionDirection(direction);
  };

  useEffect(() => {
    if (!motionDirection) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => normalizeIndex(current + (motionDirection === "next" ? 1 : -1)));
      setMotionDirection(null);
    }, transitionMs);

    return () => window.clearTimeout(timeout);
  }, [motionDirection]);

  return (
    <section className="slop-panel">
      <h1 className="slop-title slop-sticker-title">Slop Of The Week</h1>

      <div className="slop-showcase">
        <Posters
          activeIndex={activeIndex}
          motionDirection={motionDirection}
          onCycle={cycle}
          isAnimating={motionDirection !== null}
        />

        <DescriptionCarousel activeIndex={activeIndex} motionDirection={motionDirection} />
      </div>

      <div className="slop-meta">
        {activeEntry.meta.map((item) => (
          <span key={`${activeEntry.title}-${item}`} className="meta-pill hover-bob">
            {item}
          </span>
        ))}
      </div>

      <div className="rank-panel">
        <h3>Rank It</h3>
        <div className="emoji-row" role="list" aria-label="Emoji ranking options">
          {emojiRanks.map((rank) => (
            <button
              key={rank.label}
              type="button"
              className={`emoji-rank${selected.label === rank.label ? " is-selected" : ""}`}
              title={rank.label}
              aria-label={rank.label}
              onClick={() => {
                setSelected(rank);
                setPosted(null);
              }}
            >
              {rank.emoji}
            </button>
          ))}
        </div>

        <p className="selected-copy">
          Selected: {selected.emoji} {selected.label}
        </p>

        <textarea
          className="comment-box"
          placeholder="Add your ranking comment..."
          value={comment}
          onChange={(event) => {
            setComment(event.target.value);
            setPosted(null);
          }}
        />

        <div>
          <button
            type="button"
            className="post-button hover-bob"
            onClick={() =>
              setPosted(
                comment.trim()
                  ? `Posted ${selected.emoji} with your comment.`
                  : `Posted ${selected.emoji} without a comment.`
              )
            }
          >
            Post Ranking
          </button>
        </div>

        {posted ? <p className="selected-copy">{posted}</p> : null}
      </div>
    </section>
  );
}
