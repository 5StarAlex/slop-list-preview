import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";

const catalogEntries = [
  {
    title: "Kanojo, Okarishimasu",
    subtitle: "Rent-a-Girlfriend",
    image:
      "https://m.media-amazon.com/images/M/MV5BNThiMDM2MTktNGMwYi00NTY3LWEyMzQtNDg1NDBlYWIwYTU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
  },
  {
    title: "Kuroiwa Medaka ni Watashi no Kawaii ga Tsuujinai",
    subtitle: "Medaka Kuroiwa is Impervious to My Charms",
    image:
      "https://m.media-amazon.com/images/M/MV5BZWNlNWQxNGYtYzk4OC00MWRiLWExZDUtOGJmYjYyNmI1MWNhXkEyXkFqcGc@._V1_.jpg",
  },
  {
    title: "Reborn as a Vending Machine, I Now Wander the Dungeon",
    subtitle: "Reborn as a Vending Machine, I Now Wander the Dungeon",
    image:
      "https://m.media-amazon.com/images/M/MV5BZjQ2MGYyYzgtODlhZi00YjczLWJmZTEtYzIxYWM1NTQ4ZGFlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
  },
  {
    title: "Uzaki-chan wa Asobitai!",
    subtitle: "Uzaki-chan Wants to Hang Out!",
    image:
      "https://m.media-amazon.com/images/M/MV5BMTg4ZWQ0M2ItMzVmZS00MTliLWEwOGYtNTMzYzBjMDI0NjAyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
  },
  {
    title: "Don't Toy With Me, Miss Nagatoro",
    subtitle: "Don't Toy With Me",
    image:
      "https://m.media-amazon.com/images/M/MV5BZjNhM2I2YTMtYzA1MC00NTljLWJhZjQtY2JmNmZlZjZlMmI0XkEyXkFqcGc@._V1_.jpg",
  },
];

export default function CatalogPage() {
  return (
    <div className="route-page">
      <SiteHeader />
      <div className="route-shell">
        <div className="route-page-head">
          <p className="route-page-subtitle">Catalog</p>
          <h1 className="route-page-title">Slop Catalog</h1>
          <p className="route-copy">
            Fresh loadout for the catalog page, now built around the exact titles
            and posters you dropped in.
          </p>
        </div>

        <div className="route-grid catalog-route-grid">
          {catalogEntries.map((entry) => (
            <article key={entry.title} className="route-card catalog-route-card">
              <div className="catalog-image-frame">
                <Image
                  src={entry.image}
                  alt={entry.title}
                  width={1000}
                  height={1500}
                  className="catalog-image"
                  unoptimized
                />
              </div>
              <h3>{entry.title}</h3>
              <p>{entry.subtitle}</p>
              <div className="route-tag-row">
                <span className="route-tag">Catalog Pick</span>
                <span className="route-tag">Poster Live</span>
              </div>
            </article>
          ))}
        </div>

        <div className="route-box-list">
          <Link href="/" className="route-button">
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
