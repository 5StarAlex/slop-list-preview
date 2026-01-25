"use client";

import React, { useState } from "react";

interface EmojiRank {
  label: string;
  emoji: string;
}

const EMOJI_RANKS: EmojiRank[] = [
  { label: "Diddy Tier", emoji: "🧴" },
  { label: "SHE BIT IT OFF", emoji: "👹" },
  { label: "ALL TEETH", emoji: "🤢" },
  { label: "TYPE SHI", emoji: "😐" },
  { label: "USED BALL", emoji: "😤" },
  { label: "Succulent", emoji: "😩" },
  { label: "Toe Curling", emoji: "😵" },
  { label: "STRAIGHT KIRK", emoji: "😳" },
  { label: "ASH KASH Tier", emoji: "🥵" },
];

interface Props {
  description: string;
  episodes: number;
  studio: string;
  malRating: number;
}

export default function SlopEmojiMeter({ description, episodes, studio, malRating }: Props) {
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiRank | null>(null);

  return (
    <div className="mt-4 p-4 border border-green-600 rounded-lg bg-[#0f2d1d]">
      {/* Anime Details */}
      <div className="text-green-200 mb-2">
        <p>{description}</p>
        <p>Episodes: {episodes} • Studio: {studio} • MAL Rating: {malRating}</p>
      </div>

      {/* Emoji Bar */}
      <div className="flex justify-between mt-2">
        {EMOJI_RANKS.map((rank) => (
          <button
            key={rank.label}
            className={`text-2xl transition transform hover:scale-125 ${
              selectedEmoji?.label === rank.label ? "scale-150" : ""
            }`}
            onClick={() => setSelectedEmoji(rank)}
            title={rank.label}
          >
            {rank.emoji}
          </button>
        ))}
      </div>

      {/* User Comment Box */}
      {selectedEmoji && (
        <div className="mt-4">
          <p className="text-green-200 mb-2">
            You selected: {selectedEmoji.emoji} — {selectedEmoji.label}
          </p>
          <textarea
            placeholder="Add your comment..."
            className="w-full p-2 rounded border border-green-700 bg-[#123b25] text-green-100"
          />
          <button className="mt-2 bg-green-700 px-4 py-2 rounded hover:bg-green-600 transition">
            Post Rating
          </button>
        </div>
      )}
    </div>
  );
}
``
