"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import slopListLogo from "../../NewStyleIcons/SlopListLogo.png";

const LOGO_STORAGE_KEY = "slop-list-logo-choice";

const logoOptions = [
  {
    id: "classic",
    src: slopListLogo,
    alt: "Classic Slop List logo",
  },
  {
    id: "burst",
    src: "/assets/logos/slop-list-burst.png",
    alt: "Graffiti burst Slop List logo",
  },
  {
    id: "pink-star",
    src: "/assets/logos/slop-list-pink-star.png",
    alt: "Pink star Slop List logo",
  },
] as const;

export default function SlopLogo() {
  const [activeLogoId, setActiveLogoId] = useState<(typeof logoOptions)[number]["id"]>(() => {
    if (typeof window === "undefined") {
      return "classic";
    }

    const savedLogoId = window.localStorage.getItem(LOGO_STORAGE_KEY);
    if (logoOptions.some((option) => option.id === savedLogoId)) {
      return savedLogoId as (typeof logoOptions)[number]["id"];
    }

    return "classic";
  });

  const activeLogo = useMemo(
    () => logoOptions.find((option) => option.id === activeLogoId) ?? logoOptions[0],
    [activeLogoId],
  );

  function cycleLogo() {
    const activeIndex = logoOptions.findIndex((option) => option.id === activeLogoId);
    const nextLogo = logoOptions[(activeIndex + 1) % logoOptions.length];
    setActiveLogoId(nextLogo.id);
    window.localStorage.setItem(LOGO_STORAGE_KEY, nextLogo.id);
  }

  return (
    <button
      type="button"
      className={`slop-logo is-${activeLogo.id}`}
      onClick={cycleLogo}
      aria-label="Cycle Slop List logo"
      title="Cycle Slop List logo"
    >
      <Image
        key={activeLogo.id}
        src={activeLogo.src}
        alt={activeLogo.alt}
        className="slop-logo-image"
        width={360}
        height={200}
        priority
        unoptimized={typeof activeLogo.src === "string"}
      />
      <span className="slop-logo-glow" aria-hidden="true" />
      <span className="slop-logo-swap-cue" aria-hidden="true">{"\u21c4"}</span>
    </button>
  );
}
