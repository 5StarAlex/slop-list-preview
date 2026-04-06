"use client";

import Image from "next/image";
import { CSSProperties, useEffect, useState } from "react";

const transitionMs = 520;
const visibleCount = 5;
const centerJump = 3;

export type CatalogEntry = {
  title: string;
  subtitle: string;
  image: string;
  tag: string;
};

type Direction = "prev" | "next";

type CatalogCarouselProps = {
  title: string;
  entries: CatalogEntry[];
};

function normalizeIndex(index: number, length: number) {
  return (index + length) % length;
}

function getWindowEntries(entries: CatalogEntry[], startIndex: number) {
  return Array.from({ length: visibleCount }, (_, index) => entries[normalizeIndex(startIndex + index, entries.length)]);
}

export default function CatalogCarousel({
  title,
  entries,
}: CatalogCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState<Direction | null>(null);
  const [previewStartIndex, setPreviewStartIndex] = useState(0);
  const sideLeftEntry = entries[normalizeIndex(startIndex - 1, entries.length)];
  const sideRightEntry = entries[normalizeIndex(startIndex + visibleCount, entries.length)];
  const currentEntries = getWindowEntries(entries, startIndex);
  const incomingEntries = getWindowEntries(entries, previewStartIndex);
  const transitionStyle = {
    "--catalog-transition-ms": `${transitionMs}ms`,
  } as CSSProperties;

  const cycle = (nextDirection: Direction) => {
    if (direction) {
      return;
    }

    setPreviewStartIndex(
      normalizeIndex(startIndex + (nextDirection === "next" ? centerJump : -centerJump), entries.length)
    );
    setDirection(nextDirection);
  };

  useEffect(() => {
    if (!direction) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const nextStartIndex = normalizeIndex(
        startIndex + (direction === "next" ? centerJump : -centerJump),
        entries.length
      );
      setStartIndex(nextStartIndex);
      setPreviewStartIndex(nextStartIndex);
      setDirection(null);
    }, transitionMs);

    return () => window.clearTimeout(timeout);
  }, [direction, entries.length, startIndex]);

  return (
    <section className="catalog-row-section">
      <div className="catalog-row-head">
        <h2 className="catalog-row-title">{title}</h2>
      </div>

      <div className="catalog-carousel-shell">
        <button
          type="button"
          className={`catalog-side-card catalog-side-left${direction ? " is-disabled" : ""}`}
          onClick={() => cycle("prev")}
          disabled={direction !== null}
          aria-label={`Cycle ${title} backward to ${sideLeftEntry.title}`}
        >
          <span className="catalog-side-number">Prev</span>
          <div className="catalog-side-image-frame">
            <Image
              src={sideLeftEntry.image}
              alt={sideLeftEntry.title}
              width={1000}
              height={1500}
              className="catalog-side-image"
              unoptimized
            />
          </div>
        </button>

        <div className="catalog-center-window">
          <div className="catalog-center-track" style={transitionStyle}>
            <div
              className={`catalog-strip is-current${
                direction ? ` animate-catalog-strip-out-${direction}` : ""
              }`}
            >
              {currentEntries.map((entry, index) => (
                <article
                  key={`${title}-current-${entry.title}-${index}-${startIndex}`}
                  className={`catalog-poster-card${index === 2 ? " is-featured" : ""}`}
                >
                  <div className="catalog-image-frame catalog-carousel-image-frame">
                    <Image
                      src={entry.image}
                      alt={entry.title}
                      width={1000}
                      height={1500}
                      className="catalog-image"
                      unoptimized
                    />
                  </div>
                  <div className="catalog-poster-copy">
                    <strong>{entry.title}</strong>
                    <span>{entry.subtitle}</span>
                  </div>
                </article>
              ))}
            </div>

            {direction ? (
              <div className={`catalog-strip is-incoming animate-catalog-strip-in-${direction}`}>
                {incomingEntries.map((entry, index) => (
                  <article
                    key={`${title}-incoming-${entry.title}-${index}-${previewStartIndex}`}
                    className={`catalog-poster-card${index === 2 ? " is-featured" : ""}`}
                  >
                    <div className="catalog-image-frame catalog-carousel-image-frame">
                      <Image
                        src={entry.image}
                        alt={entry.title}
                        width={1000}
                        height={1500}
                        className="catalog-image"
                        unoptimized
                      />
                    </div>
                    <div className="catalog-poster-copy">
                      <strong>{entry.title}</strong>
                      <span>{entry.subtitle}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          className={`catalog-side-card catalog-side-right${direction ? " is-disabled" : ""}`}
          onClick={() => cycle("next")}
          disabled={direction !== null}
          aria-label={`Cycle ${title} forward to ${sideRightEntry.title}`}
        >
          <span className="catalog-side-number">Next</span>
          <div className="catalog-side-image-frame">
            <Image
              src={sideRightEntry.image}
              alt={sideRightEntry.title}
              width={1000}
              height={1500}
              className="catalog-side-image"
              unoptimized
            />
          </div>
        </button>
      </div>
    </section>
  );
}
