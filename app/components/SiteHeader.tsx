"use client";

import GlobalProfileWidget from "./GlobalProfileWidget";
import SiteNav from "./SiteNav";
import SpaceParallaxLayers from "./SpaceParallaxLayers";
import { useParallaxOffset } from "./useParallaxOffset";
import SlopLogo from "./layout/SlopLogo";

type SiteHeaderProps = {
  navVariant?: "default" | "profile";
};

export default function SiteHeader({ navVariant = "default" }: SiteHeaderProps) {
  const { offset, handleMouseMove, handleMouseLeave } = useParallaxOffset();

  return (
    <header
      className="slop-site-header"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="slop-site-header__shell">
        <SpaceParallaxLayers
          offset={offset}
          className="slop-site-header__layers"
          includeNebula
          includeScanlines
          intensity="medium"
        />
        <SlopLogo />
        <SiteNav variant={navVariant} />
      </div>
      <GlobalProfileWidget />
    </header>
  );
}
