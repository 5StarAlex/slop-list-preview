"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type CSSProperties, type SVGProps, useEffect, useMemo, useState } from "react";
import { useAccount } from "./AccountProvider";
import SlopLogo from "./layout/SlopLogo";
import { useParallaxOffset } from "./useParallaxOffset";

type ComicShellProps = {
  children: React.ReactNode;
  className?: string;
};

const navItems = [
  { href: "/", label: "Home", icon: "home", color: "pink" },
  { href: "/catalog", label: "Catalog", icon: "search", color: "orange" },
  { href: "/games", label: "Genres", icon: "smile", color: "blue" },
  { href: "/create", label: "New Entry", icon: "pen", color: "pink" },
  { href: "/shop", label: "Slop Shop", icon: "shop", color: "cyan" },
  { href: "/profile", label: "Create-A-Slop", icon: "smile", color: "purple" },
] as const;

type ComicNavIconName = (typeof navItems)[number]["icon"];

const comicBackgrounds = [
  { key: "main", label: "Main", image: null },
  { key: "flame", label: "Flame", image: "/demo-2/bg-flame.jpg" },
  { key: "field", label: "Field", image: "/demo-2/bg-field.jpg" },
  { key: "sky", label: "Sky", image: "/demo-2/bg-sky.jpg" },
  { key: "arcade", label: "Arcade", image: "/demo-2/bg-arcade.jpg" },
  { key: "nebula", label: "Nebula", image: null },
  { key: "city", label: "City", image: null },
  { key: "forest", label: "Forest", image: null },
  { key: "synth", label: "Synth", image: null },
  { key: "sunrise", label: "Sunrise", image: null },
] as const;

export default function ComicShell({ children, className = "" }: ComicShellProps) {
  const pathname = usePathname();
  const { account, updateProfile } = useAccount();
  const { offset, handleMouseMove, handleMouseLeave } = useParallaxOffset();
  const profile = account.profile;
  const activeBackground = useMemo(
    () => comicBackgrounds.find((option) => option.key === profile.siteBackground) ?? comicBackgrounds[0],
    [profile.siteBackground],
  );
  const themeStyle = ({
    "--comic-theme-bg": activeBackground.image ? `url(${activeBackground.image})` : "none",
    "--shell-tab-x": `${offset.x * 10}px`,
    "--shell-tab-y": `${offset.y * 8}px`,
    "--shell-tab-gloss-x": `${offset.x * -4}px`,
    "--shell-tab-gloss-y": `${offset.y * -3}px`,
    "--shell-tab-line-x": `${offset.x * 2.2}px`,
    "--shell-tab-line-y": `${offset.y * 1.8}px`,
    "--shell-layer-back": `translate(${offset.x * -10}px, ${offset.y * -7}px)`,
    "--shell-layer-mid": `translate(${offset.x * 24}px, ${offset.y * 16}px)`,
    "--shell-layer-front": `translate(${offset.x * -38}px, ${offset.y * -24}px)`,
  } as CSSProperties);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileClosing, setProfileClosing] = useState(false);

  const closeProfile = () => {
    setProfileClosing(true);
    window.setTimeout(() => {
      setProfileOpen(false);
      setProfileClosing(false);
    }, 220);
  };

  useEffect(() => {
    if (!profileOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeProfile();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [profileOpen]);

  return (
    <div
      className={`demo2-page comic-app bg-${profile.siteBackground}${profile.darkMode ? " theme-dark" : ""}${profile.glossyMode ? " theme-glossy" : ""} ${className}`.trim()}
      style={themeStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="comic-shell-parallax" aria-hidden="true">
        <span className="comic-shell-shape-layer comic-shell-shape-layer-back" />
        <span className="comic-shell-shape-layer comic-shell-shape-layer-mid" />
        <span className="comic-shell-shape-layer comic-shell-shape-layer-front" />
      </div>
      <header className="comic-header" aria-label="Slop List navigation">
        <SlopLogo />

        <nav className="comic-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`comic-nav-item is-${item.color}${pathname === item.href ? " is-active" : ""}`}
            >
              <ComicNavIcon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button type="button" className="comic-profile-card" onClick={() => setProfileOpen(true)} aria-label="Open profile card">
          <span className="comic-profile-avatar">
            <Image src={profile.profileImage} alt="" fill unoptimized className="comic-profile-avatar-image" />
          </span>
          <span className="comic-profile-copy">
            <strong>{profile.displayName}</strong>
            <span>{profile.affiliation}</span>
            <em><span aria-hidden="true">{"\u2605"}</span> {account.economy.coins}</em>
          </span>
        </button>
      </header>

      {children}

      {profileOpen ? (
        <div className="comic-profile-overlay" role="presentation" onClick={closeProfile}>
          <aside
            className={`comic-profile-popout${profileClosing ? " is-leaving" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label="Profile card"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="comic-popout-close" onClick={closeProfile} aria-label="Close profile card">
              {"\u00d7"}
            </button>
            <div className="comic-popout-head">
              <span className="comic-popout-avatar">
                <Image src={profile.profileImage} alt={`${profile.displayName} profile`} fill unoptimized />
              </span>
              <div>
                <h2>{profile.displayName}</h2>
                <p>{profile.affiliation}</p>
                <strong><span aria-hidden="true">{"\u2605"}</span> {account.economy.coins}</strong>
              </div>
            </div>
            <div className="comic-popout-stats">
              <span><strong>{account.economy.coins}</strong> Stars</span>
              <span><strong>{account.progression.level}</strong> Level</span>
              <span><strong>{account.progression.xp}</strong> XP</span>
            </div>
            <p className="comic-popout-copy">{profile.description}</p>
            <section className="comic-theme-picker" aria-label="Theme background">
              <h3>Theme Background</h3>
              <div className="comic-theme-options">
                {comicBackgrounds.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className={`comic-theme-option${profile.siteBackground === option.key ? " is-active" : ""}`}
                    onClick={() => updateProfile({ ...profile, siteBackground: option.key })}
                  >
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </section>
            <Link href="/profile" className="comic-popout-action" onClick={closeProfile}>
              Open Create-A-Slop
            </Link>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function ComicNavIcon({ name }: { name: ComicNavIconName }) {
  const iconProps: SVGProps<SVGSVGElement> = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "comic-nav-icon",
    "aria-hidden": true,
  };

  if (name === "home") {
    return (
      <svg {...iconProps}>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M6.5 10.5v8h4v-4.8h3v4.8h4v-8" />
      </svg>
    );
  }

  if (name === "search") {
    return (
      <svg {...iconProps}>
        <circle cx="10.5" cy="10.5" r="6.2" />
        <path d="m15.2 15.2 5 5" />
      </svg>
    );
  }

  if (name === "pen") {
    return (
      <svg {...iconProps}>
        <path d="m4 19 4.2-1 10-10a2.2 2.2 0 0 0-3.1-3.1l-10 10L4 19Z" />
        <path d="m13.8 6.2 4 4" />
      </svg>
    );
  }

  if (name === "shop") {
    return (
      <svg {...iconProps}>
        <path d="M4.5 10h15l-1.2-5.2H5.7L4.5 10Z" />
        <path d="M6 10v9h12v-9" />
        <path d="M9 19v-5h6v5" />
        <path d="M4.5 10c.8 2.1 3.2 2.1 4 0 .8 2.1 3.2 2.1 4 0 .8 2.1 3.2 2.1 4 0 .8 2.1 3.2 2.1 4 0" />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="8" />
      <path d="M8.5 10h.1" />
      <path d="M15.5 10h.1" />
      <path d="M8.5 14.2c1.7 1.8 5.3 1.8 7 0" />
    </svg>
  );
}
