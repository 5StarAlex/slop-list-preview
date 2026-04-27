"use client";

import Image from "next/image";
import slopListLogo from "../NewStyleIcons/SlopListLogo.png";
import SiteNav from "./SiteNav";
import SpaceParallaxLayers from "./SpaceParallaxLayers";
import { useParallaxOffset } from "./useParallaxOffset";

type SiteHeaderProps = {
  navVariant?: "default" | "profile";
};

export default function SiteHeader({ navVariant = "default" }: SiteHeaderProps) {
  const { offset, handleMouseMove, handleMouseLeave } = useParallaxOffset();

  return (
    <header
      className="space-banner"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="space-banner-shell">
        <SpaceParallaxLayers
          offset={offset}
          className="space-banner-layers"
          includeNebula
          includeScanlines
          intensity="medium"
        />
        <div className="logo-stack">
          <div
            className="logo-image-wrap"
            style={{ ["--logo-mask" as string]: `url(${slopListLogo.src})` }}
          >
            <Image src={slopListLogo} alt="Slop List" className="logo-image" priority />
            <span className="logo-image-gleam" aria-hidden="true" />
          </div>
        </div>

        <SiteNav variant={navVariant} />
      </div>
    </header>
  );
}
