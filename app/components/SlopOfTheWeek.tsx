"use client";

import Image from "next/image";
import { useState } from "react";

const emojiRanks = [
  { emoji: "\u{1F9F4}", label: "Lotion Bottle" },
  { emoji: "\u{1F479}", label: "Demon" },
  { emoji: "\u{1F922}", label: "Sick" },
  { emoji: "\u{1F610}", label: "Straight Face" },
  { emoji: "\u{1F624}", label: "Angry Steam" },
  { emoji: "\u{1F629}", label: "Groan" },
  { emoji: "\u{1F635}", label: "Swirly Face" },
  { emoji: "\u{1F975}", label: "Flustered" },
];

const primaryImage =
  "https://a.storyblok.com/f/178900/720x1019/92a2df354f/f8bb861fa9fb82fb3d5f8887c36668231651454540_main.jpg/m/filters:quality(95)format(webp)";
const fallbackImage =
  "https://static.wikia.nocookie.net/voiceacting/images/3/36/More_Than_a_Married_Couple%2C_But_Not_Lovers.jpg/revision/latest?cb=20221022013500";

export default function SlopOfTheWeek() {
  const [selected, setSelected] = useState(emojiRanks[0]);
  const [comment, setComment] = useState("");
  const [posted, setPosted] = useState<string | null>(null);
  const [coverSrc, setCoverSrc] = useState(primaryImage);

  return (
    <section className="slop-panel">
      <h1 className="slop-title">Slop Of The Week</h1>

      <div className="image-frame">
        <span className="crown-badge" aria-hidden="true">
          {"\u{1F451}"}
        </span>
        <Image
          src={coverSrc}
          alt="More Than a Married Couple, But Not Lovers promotional art"
          className="floating-cover"
          width={720}
          height={1019}
          unoptimized
          onError={() => setCoverSrc(fallbackImage)}
        />
      </div>

      <div>
        <h2 className="slop-name">More Than a Married Couple, But Not Lovers</h2>
        <p className="slop-copy">
          A fake-marriage school experiment full of bright chemistry, dramatic
          glances, and the exact kind of messy romantic tension this site exists
          to archive.
        </p>
      </div>

      <div className="slop-meta">
        <span className="meta-pill hover-bob">MAL Rating: 7.59</span>
        <span className="meta-pill hover-bob">Rom-Com</span>
        <span className="meta-pill hover-bob">12 Episodes</span>
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
