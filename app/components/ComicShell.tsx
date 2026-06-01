"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useAccount } from "./AccountProvider";
import SlopLogo from "./layout/SlopLogo";
import { useParallaxOffset } from "./useParallaxOffset";

type ComicShellProps = {
  children: React.ReactNode;
  className?: string;
};

const navItems = [
  { href: "/", label: "Home", icon: "HOME", color: "#ff7043", tone: "pink" },
  { href: "/catalog", label: "Watchlist", icon: "LIST", color: "#31c8ff", tone: "cyan" },
  { href: "/community", label: "Community", icon: "CHAT", color: "#8e5cff", tone: "purple" },
  { href: "/games", label: "Arcade", icon: "PLAY", color: "#ffbf2e", tone: "orange" },
  { href: "/shop", label: "Shop", icon: "SHOP", color: "#ff4da6", tone: "pink" },
  { href: "/create", label: "Post", icon: "POST", color: "#26d57c", tone: "cyan" },
  { href: "/profile", label: "Avatar", icon: "ME", color: "#ff7b38", tone: "orange" },
  { href: "/about", label: "About", icon: "INFO", color: "#6f8cff", tone: "blue" },
] as const;

const sparkleSlots = Array.from({ length: 32 }, (_, index) => ({
  left: `${(index * 37) % 100}vw`,
  delay: `${((index * 19) % 40) / 10}s`,
  duration: `${3 + ((index * 11) % 40) / 10}s`,
}));

const comicBackgrounds = [
  { key: "main", label: "Main", image: "/demo-2/bg-main.jpg" },
  { key: "flame", label: "Flame", image: "/demo-2/bg-flame.jpg" },
  { key: "field", label: "Field", image: "/demo-2/bg-field.jpg" },
  { key: "sky", label: "Sky", image: "/demo-2/bg-sky.jpg" },
  { key: "arcade", label: "Arcade", image: "/demo-2/bg-arcade.jpg" },
  { key: "nebula", label: "Nebula", image: "/demo-2/bg-nebula.jpg" },
  { key: "city", label: "City", image: "/demo-2/bg-city.jpg" },
  { key: "forest", label: "Forest", image: "/demo-2/bg-forest.jpg" },
  { key: "synth", label: "Synth", image: "/demo-2/bg-synth.jpg" },
  { key: "sunrise", label: "Sunrise", image: "/demo-2/bg-sunrise.jpg" },
] as const;

const profilePostRows = [
  { title: "Top slop streak", meta: "2m ago", copy: "Moved three shows into the watch list and kept the vote streak alive." },
  { title: "Fit check passed", meta: "18m ago", copy: "Updated the profile theme, badge crop, and catalog main tags." },
  { title: "Queue cleaned", meta: "1h ago", copy: "Trimmed the backlog down to the next six episodes worth watching." },
  { title: "Theme swap", meta: "Yesterday", copy: "Tried Sky, Arcade, and Main before locking the current background." },
] as const;

export default function ComicShell({ children, className = "" }: ComicShellProps) {
  const pathname = usePathname();
  const isHomeRoute = pathname === "/";
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

  const profileOverlay = (
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
        <div className="comic-profile-takeover-bg" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="comic-profile-showcase">
          <section className="comic-profile-main-card" aria-label="Profile summary">
            <span className="comic-profile-badge">
              <Image src={profile.profileImage} alt="" fill unoptimized />
            </span>
            <header className="comic-profile-main-head">
              <div>
                <span>{profile.username}</span>
                <h2>{profile.displayName}</h2>
              </div>
              <span aria-hidden="true">...</span>
            </header>
            <div className="comic-profile-portrait">
              <Image src={profile.profileImage} alt={`${profile.displayName} profile`} fill unoptimized />
            </div>
            <p className="comic-profile-bio">{profile.description}</p>
            <p className="comic-profile-rank">
              <span aria-hidden="true">V</span>
              {profile.affiliation}
            </p>
            <div className="comic-profile-tag-row" aria-label="Profile tags">
              <span>Confident</span>
              <span>Catalog Main</span>
              <span>Top Slop</span>
            </div>
          </section>

          <section className="comic-profile-comment-card" aria-label="Recent profile posts">
            <header>
              <span aria-hidden="true" />
              <div>
                <small>Profile activity</small>
                <h3>Recent Posts</h3>
              </div>
            </header>
            <div className="comic-profile-comment-list">
              {profilePostRows.map((post) => (
                <p key={post.title}>
                  <span>{post.title.slice(0, 1)}</span>
                  <strong>{post.title}<small>{post.meta}</small></strong>
                  <em>{post.copy}</em>
                </p>
              ))}
            </div>
          </section>
        </div>

        <div className="comic-profile-control-strip">
          <div className="comic-popout-stats">
            <span><strong>{account.economy.coins}</strong> Stars</span>
            <span><strong>{account.progression.level}</strong> Level</span>
            <span><strong>{account.progression.xp}</strong> XP</span>
          </div>
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
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <div
        className={`demo2-page comic-app bg-${profile.siteBackground}${isHomeRoute ? " is-home-route" : " is-inner-route"}${profile.darkMode ? " theme-dark" : ""}${profile.glossyMode ? " theme-glossy" : ""} ${className}`.trim()}
        style={themeStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="comic-shell-parallax" aria-hidden="true">
          <span className="comic-shell-shape-layer comic-shell-shape-layer-back" />
          <span className="comic-shell-shape-layer comic-shell-shape-layer-mid" />
          <span className="comic-shell-shape-layer comic-shell-shape-layer-front" />
        </div>
        <div className="experiment-pixel-bg" aria-hidden="true" />
        <div className="experiment-waves" aria-hidden="true" />
        <div className="experiment-sparkles" aria-hidden="true">
          {sparkleSlots.map((sparkle, index) => (
            <i key={index} style={{ left: sparkle.left, animationDelay: sparkle.delay, animationDuration: sparkle.duration }} />
          ))}
        </div>

        <header className="comic-header experiment-topbar" aria-label="Slop List navigation">
          {isHomeRoute ? (
            <SlopLogo />
          ) : (
            <Link href="/" className="experiment-inner-wordmark" aria-label="Slop List home">
              SLOP LIST
            </Link>
          )}

          <button type="button" className="comic-profile-card experiment-player-card" onClick={() => setProfileOpen(true)} aria-label="Open profile card">
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

        <nav className="experiment-side-tabs" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`experiment-tab is-${item.tone}${pathname === item.href ? " is-active" : ""}`}
              style={{ "--c": item.color } as CSSProperties}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {children}
      </div>
      {profileOpen && typeof document !== "undefined" ? createPortal(profileOverlay, document.body) : null}
    </>
  );
}
