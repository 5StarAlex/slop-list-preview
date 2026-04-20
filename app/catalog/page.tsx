"use client";

import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import CatalogCarousel, { CatalogEntry } from "../components/CatalogCarousel";

const slopPool: CatalogEntry[] = [
  {
    title: "Kanojo, Okarishimasu",
    subtitle: "Rent-a-Girlfriend",
    image:
      "https://m.media-amazon.com/images/M/MV5BNThiMDM2MTktNGMwYi00NTY3LWEyMzQtNDg1NDBlYWIwYTU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    tag: "Certified Mess",
  },
  {
    title: "Kuroiwa Medaka ni Watashi no Kawaii ga Tsuujinai",
    subtitle: "Medaka Kuroiwa is Impervious to My Charms",
    image:
      "https://m.media-amazon.com/images/M/MV5BZWNlNWQxNGYtYzk4OC00MWRiLWExZDUtOGJmYjYyNmI1MWNhXkEyXkFqcGc@._V1_.jpg",
    tag: "Charm Check",
  },
  {
    title: "Reborn as a Vending Machine, I Now Wander the Dungeon",
    subtitle: "Reborn as a Vending Machine",
    image:
      "https://m.media-amazon.com/images/M/MV5BZjQ2MGYyYzgtODlhZi00YjczLWJmZTEtYzIxYWM1NTQ4ZGFlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    tag: "Dungeon Slop",
  },
  {
    title: "Uzaki-chan wa Asobitai!",
    subtitle: "Uzaki-chan Wants to Hang Out!",
    image:
      "https://m.media-amazon.com/images/M/MV5BMTg4ZWQ0M2ItMzVmZS00MTliLWEwOGYtNTMzYzBjMDI0NjAyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    tag: "Gremlin Energy",
  },
  {
    title: "Don't Toy With Me, Miss Nagatoro",
    subtitle: "Don't Toy With Me",
    image:
      "https://m.media-amazon.com/images/M/MV5BZjNhM2I2YTMtYzA1MC00NTljLWJhZjQtY2JmNmZlZjZlMmI0XkEyXkFqcGc@._V1_.jpg",
    tag: "Bully Arc",
  },
  {
    title: "RWBY",
    subtitle: "Weapons, drama, and pure momentum",
    image: "https://m.media-amazon.com/images/M/MV5BOGM4MTQwMDQtMDIxZC00MTQ3LWEyYWQtOTI5Y2E2MDA5OTQ0XkEyXkFqcGc@._V1_.jpg",
    tag: "Action Pick",
  },
  {
    title: "More Than a Married Couple, But Not Lovers",
    subtitle: "Marriage training goes left fast",
    image:
      "https://a.storyblok.com/f/178900/720x1019/92a2df354f/f8bb861fa9fb82fb3d5f8887c36668231651454540_main.jpg/m/filters:quality(95)format(webp)",
    tag: "Rom-Com Slop",
  },
  {
    title: "Isekai Quartet",
    subtitle: "The crossover gremlin school",
    image:
      "https://m.media-amazon.com/images/M/MV5BMGFmNmE0MDMtZjY2Ny00YjlmLWJhMmItYjY1ZDg3ZjI0ZTNmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    tag: "Chibi Chaos",
  },
  {
    title: "Miraculous: Tales of Ladybug and Cat Noir",
    subtitle: "Paris, secrets, and maximum looped drama",
    image:
      "https://m.media-amazon.com/images/M/MV5BODQ5NGFjZTQtNDkzNy00YWVjLWJiNGMtNTk1YzVmMmQ1YWQwXkEyXkFqcGc@._V1_.jpg",
    tag: "Hero Drama",
  },
  {
    title: "The Seven Deadly Sins",
    subtitle: "Big sins, bigger yelling",
    image:
      "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p12296875_b_v8_aa.jpg",
    tag: "Battle Slop",
  },
  {
    title: "Superhero Movie",
    subtitle: "Parody brainrot in feature-length form",
    image: "https://upload.wikimedia.org/wikipedia/en/8/8c/Superhero_movie.jpg",
    tag: "Movie Disaster",
  },
  {
    title: "Ex-Arm",
    subtitle: "The polygon incident",
    image:
      "https://m.media-amazon.com/images/M/MV5BM2E2YTUxZWEtNGE0ZS00ZWJmLWE4MzctZjkzOTNlYjQ3MTQ1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    tag: "Infamous Pick",
  },
];

const sectionEntries = {
  forYou: [slopPool[6], slopPool[3], slopPool[8], slopPool[1], slopPool[2], slopPool[7], slopPool[4], slopPool[0]],
  highestRated: [slopPool[5], slopPool[9], slopPool[6], slopPool[8], slopPool[7], slopPool[3], slopPool[0], slopPool[1]],
  upcoming: [slopPool[11], slopPool[10], slopPool[2], slopPool[4], slopPool[8], slopPool[9], slopPool[6], slopPool[7]],
};

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedQuery = searchTerm.trim().toLowerCase();
  const filteredEntries = slopPool.filter((entry) => entry.title.toLowerCase().startsWith(normalizedQuery));
  const isSearchMode = normalizedQuery.length > 0;

  return (
    <div className="route-page">
      <SiteHeader />
      <div className="route-shell catalog-page-shell">
        <div className="route-page-head">
          <p className="route-page-subtitle">Catalog</p>
          <h1 className="route-page-title">Slop Catalog</h1>
        </div>

        <div className="catalog-search-shell">
          <button
            type="button"
            className="catalog-search-clear"
            onClick={() => setSearchTerm("")}
            aria-label="Clear search and return to main page catalog"
          >
            Clear
          </button>

          <label className="catalog-search-bar">
            <span className="catalog-search-icon" aria-hidden="true">
              
            </span>
            <input
              type="text"
              className="catalog-search-input"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search the slop..."
              aria-label="Search catalog"
            />
          </label>
        </div>

        <div className="catalog-section-stack">
          {isSearchMode ? (
            filteredEntries.length > 0 ? (
              <CatalogCarousel title="Search" entries={filteredEntries} />
            ) : (
              <section className="route-card catalog-empty-state">
                <h2 className="catalog-row-title">Search</h2>
                <p className="route-copy">No slop titles start with &quot;{searchTerm}&quot; right now.</p>
              </section>
            )
          ) : (
            <>
              <CatalogCarousel
                title="Slop For You"
                entries={sectionEntries.forYou}
              />
              <CatalogCarousel
                title="Highest Rated Slop"
                entries={sectionEntries.highestRated}
              />
              <CatalogCarousel
                title="Upcoming Slop"
                entries={sectionEntries.upcoming}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
