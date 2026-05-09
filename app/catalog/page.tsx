"use client";

import { useState } from "react";
import SlopPageShell from "../components/layout/SlopPageShell";
import CatalogCarousel, { type CatalogEntry } from "../components/CatalogCarousel";

const slopPool: CatalogEntry[] = [
  {
    title: "Kanojo, Okarishimasu",
    subtitle: "Rent-a-Girlfriend",
    image: "https://m.media-amazon.com/images/M/MV5BNThiMDM2MTktNGMwYi00NTY3LWEyMzQtNDg1NDBlYWIwYTU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    tag: "Certified Mess",
  },
  {
    title: "Kuroiwa Medaka ni Watashi no Kawaii ga Tsuujinai",
    subtitle: "Medaka Kuroiwa is Impervious to My Charms",
    image: "https://m.media-amazon.com/images/M/MV5BZWNlNWQxNGYtYzk4OC00MWRiLWExZDUtOGJmYjYyNmI1MWNhXkEyXkFqcGc@._V1_.jpg",
    tag: "Charm Check",
  },
  {
    title: "Reborn as a Vending Machine, I Now Wander the Dungeon",
    subtitle: "Reborn as a Vending Machine",
    image: "https://m.media-amazon.com/images/M/MV5BZjQ2MGYyYzgtODlhZi00YjczLWJmZTEtYzIxYWM1NTQ4ZGFlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    tag: "Dungeon Slop",
  },
  {
    title: "Uzaki-chan wa Asobitai!",
    subtitle: "Uzaki-chan Wants to Hang Out!",
    image: "https://m.media-amazon.com/images/M/MV5BMTg4ZWQ0M2ItMzVmZS00MTliLWEwOGYtNTMzYzBjMDI0NjAyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    tag: "Gremlin Energy",
  },
  {
    title: "Miraculous: Tales of Ladybug and Cat Noir",
    subtitle: "Paris, secrets, and maximum looped drama",
    image: "https://m.media-amazon.com/images/M/MV5BODQ5NGFjZTQtNDkzNy00YWVjLWJiNGMtNTk1YzVmMmQ1YWQwXkEyXkFqcGc@._V1_.jpg",
    tag: "Hero Drama",
  },
];

const sectionEntries = {
  forYou: slopPool,
  highestRated: [slopPool[4], slopPool[0], slopPool[3], slopPool[1], slopPool[2]],
  upcoming: [slopPool[2], slopPool[1], slopPool[4], slopPool[0], slopPool[3]],
};

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedQuery = searchTerm.trim().toLowerCase();
  const filteredEntries = slopPool.filter((entry) => entry.title.toLowerCase().includes(normalizedQuery));

  return (
    <SlopPageShell>
      <div className="slop-page-heading">
        <div>
          <p className="slop-page-kicker">Catalog</p>
          <h1 className="slop-page-title">Slop Catalog</h1>
        </div>
      </div>

      <div className="slop-catalog-search">
        <button type="button" className="slop-catalog-clear" onClick={() => setSearchTerm("")}>
          Clear
        </button>
        <label className="slop-catalog-searchbar">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search the slop..."
            aria-label="Search catalog"
          />
        </label>
      </div>

      <div className="slop-catalog-stack">
        {normalizedQuery ? (
          filteredEntries.length > 0 ? (
            <CatalogCarousel title="Search Results" entries={filteredEntries} />
          ) : (
            <div className="slop-catalog-empty">No slop titles matched &quot;{searchTerm}&quot;.</div>
          )
        ) : (
          <>
            <CatalogCarousel title="Slop For You" entries={sectionEntries.forYou} />
            <CatalogCarousel title="Highest Rated Slop" entries={sectionEntries.highestRated} />
            <CatalogCarousel title="Fresh Slop" entries={sectionEntries.upcoming} />
          </>
        )}
      </div>
    </SlopPageShell>
  );
}
