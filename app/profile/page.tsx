"use client";

import Image from "next/image";
import { CSSProperties, FormEvent, useEffect, useState } from "react";
import CreateASlop from "../components/CreateASlop";
import SiteHeader from "../components/SiteHeader";
import SiteNav from "../components/SiteNav";

type ProfileTheme = "black" | "white" | "red" | "blue" | "gray" | "aurora";

type ProfileData = {
  profileImage: string;
  bannerImage: string;
  displayName: string;
  username: string;
  description: string;
  affiliation: string;
  affiliationTextColor: string;
  affiliationBoxColor: string;
  theme: ProfileTheme;
};

const socialBadges = [
  {
    colorClass: "profile-social-blue",
    label: "Shield Badge",
    iconUrl:
      "https://png.pngtree.com/png-vector/20250708/ourmid/pngtree-pixel-art-protection-shield-shape-object-graphic-element-vector-png-image_16718385.webp",
  },
  {
    colorClass: "profile-social-pink",
    label: "Trophy Badge",
    iconUrl:
      "https://png.pngtree.com/png-clipart/20220704/ourmid/pngtree-trophy-cup-winner-pixel-illustration-png-image_5685913.png",
  },
  {
    colorClass: "profile-social-green",
    label: "Medal Badge",
    iconUrl:
      "https://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/468583d21fd7248.png",
  },
];

const gameCollection = ["F1", "DBD", "WF", "+2"];
const PROFILE_STORAGE_KEY = "slop-list-profile-settings";

const defaultProfile: ProfileData = {
  profileImage: "https://i.redd.it/6c8d5tlwsfpb1.jpg",
  bannerImage:
    "https://as1.ftcdn.net/v2/jpg/05/22/33/10/1000_F_522331099_Ha6ktAQY8ghcAR8PAqAqeKZZLRPm5g5W.jpg",
  displayName: "Aerial Ace",
  username: "5staralex",
  description:
    "Top slop sargent.",
  affiliation: "Jitty Boys",
  affiliationTextColor: "#f8d899",
  affiliationBoxColor: "rgba(255, 248, 230, 0.1)",
  theme: "black",
};

const themeStyles: Record<ProfileTheme, Record<string, string>> = {
  black: {
    "--profile-page-text": "#f3f4f6",
    "--profile-logo": "#f6f7fb",
    "--profile-logo-sub": "#99a0b3",
    "--profile-marquee-border": "#222733",
    "--profile-marquee-bg": "linear-gradient(180deg, #141820, #0f131a)",
    "--profile-card-border": "#242934",
    "--profile-card-bg": "linear-gradient(180deg, #17191f, #1b1d24)",
    "--profile-card-shadow": "0 16px 40px rgba(0, 0, 0, 0.35)",
    "--profile-banner-overlay": "linear-gradient(180deg, rgba(7, 8, 12, 0.16), rgba(7, 8, 12, 0.4))",
    "--profile-avatar-ring": "#1b1d24",
    "--profile-avatar-shell": "#191b22",
    "--profile-text-main": "#f5f7fb",
    "--profile-text-soft": "#d8dae1",
    "--profile-text-muted": "#a7adbc",
    "--profile-tag-bg": "rgba(255, 248, 230, 0.1)",
    "--profile-tag-text": "#f8d899",
    "--profile-panel-bg": "linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.05))",
    "--profile-panel-border": "rgba(255, 255, 255, 0.06)",
    "--profile-pill-bg": "#101217",
    "--profile-pill-text": "#f3f5fa",
    "--profile-icon-bg": "rgba(10, 11, 15, 0.72)",
    "--profile-icon-border": "rgba(255, 255, 255, 0.12)",
    "--profile-overlay": "rgba(4, 5, 8, 0.66)",
  },
  white: {
    "--profile-page-text": "#1e2430",
    "--profile-logo": "#1f2a36",
    "--profile-logo-sub": "#6e7784",
    "--profile-marquee-border": "#cfd5de",
    "--profile-marquee-bg": "linear-gradient(180deg, #fafbfd, #eceff4)",
    "--profile-card-border": "#d7dde5",
    "--profile-card-bg": "linear-gradient(180deg, #ffffff, #f4f6f9)",
    "--profile-card-shadow": "0 16px 40px rgba(46, 58, 76, 0.14)",
    "--profile-banner-overlay": "linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(245, 247, 250, 0.26))",
    "--profile-avatar-ring": "#f4f6f9",
    "--profile-avatar-shell": "#ffffff",
    "--profile-text-main": "#1f2733",
    "--profile-text-soft": "#465264",
    "--profile-text-muted": "#6c7688",
    "--profile-tag-bg": "rgba(26, 35, 46, 0.06)",
    "--profile-tag-text": "#8d641c",
    "--profile-panel-bg": "linear-gradient(180deg, rgba(22, 34, 48, 0.04), rgba(22, 34, 48, 0.02))",
    "--profile-panel-border": "rgba(29, 39, 52, 0.09)",
    "--profile-pill-bg": "#e9edf3",
    "--profile-pill-text": "#1f2733",
    "--profile-icon-bg": "rgba(255, 255, 255, 0.72)",
    "--profile-icon-border": "rgba(29, 39, 52, 0.12)",
    "--profile-overlay": "rgba(14, 20, 28, 0.42)",
  },
  red: {
    "--profile-page-text": "#fff3f2",
    "--profile-logo": "#fff6f5",
    "--profile-logo-sub": "#f0b6b0",
    "--profile-marquee-border": "#5a2128",
    "--profile-marquee-bg": "linear-gradient(180deg, #351319, #210b0f)",
    "--profile-card-border": "#5f242a",
    "--profile-card-bg": "linear-gradient(180deg, #321116, #220c10)",
    "--profile-card-shadow": "0 16px 40px rgba(49, 9, 13, 0.36)",
    "--profile-banner-overlay": "linear-gradient(180deg, rgba(56, 8, 14, 0.14), rgba(24, 4, 7, 0.48))",
    "--profile-avatar-ring": "#220c10",
    "--profile-avatar-shell": "#2b1015",
    "--profile-text-main": "#fff5f3",
    "--profile-text-soft": "#f6d4d0",
    "--profile-text-muted": "#dca3a0",
    "--profile-tag-bg": "rgba(255, 233, 205, 0.1)",
    "--profile-tag-text": "#ffcf9f",
    "--profile-panel-bg": "linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))",
    "--profile-panel-border": "rgba(255, 226, 222, 0.08)",
    "--profile-pill-bg": "#17090c",
    "--profile-pill-text": "#fff5f3",
    "--profile-icon-bg": "rgba(31, 8, 12, 0.78)",
    "--profile-icon-border": "rgba(255, 226, 222, 0.14)",
    "--profile-overlay": "rgba(22, 3, 6, 0.66)",
  },
  blue: {
    "--profile-page-text": "#edf6ff",
    "--profile-logo": "#f4f9ff",
    "--profile-logo-sub": "#9fbfdd",
    "--profile-marquee-border": "#223d66",
    "--profile-marquee-bg": "linear-gradient(180deg, #101b31, #0b1322)",
    "--profile-card-border": "#284777",
    "--profile-card-bg": "linear-gradient(180deg, #13203a, #0f182c)",
    "--profile-card-shadow": "0 16px 40px rgba(6, 17, 43, 0.4)",
    "--profile-banner-overlay": "linear-gradient(180deg, rgba(8, 22, 48, 0.16), rgba(5, 11, 28, 0.46))",
    "--profile-avatar-ring": "#0f182c",
    "--profile-avatar-shell": "#13203a",
    "--profile-text-main": "#f4f9ff",
    "--profile-text-soft": "#d7e6fb",
    "--profile-text-muted": "#9cb3d5",
    "--profile-tag-bg": "rgba(228, 241, 255, 0.1)",
    "--profile-tag-text": "#99d0ff",
    "--profile-panel-bg": "linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))",
    "--profile-panel-border": "rgba(226, 241, 255, 0.08)",
    "--profile-pill-bg": "#091220",
    "--profile-pill-text": "#f4f9ff",
    "--profile-icon-bg": "rgba(7, 15, 31, 0.78)",
    "--profile-icon-border": "rgba(226, 241, 255, 0.14)",
    "--profile-overlay": "rgba(4, 10, 23, 0.66)",
  },
  gray: {
    "--profile-page-text": "#f1f3f5",
    "--profile-logo": "#f5f7fa",
    "--profile-logo-sub": "#aab1bb",
    "--profile-marquee-border": "#343a44",
    "--profile-marquee-bg": "linear-gradient(180deg, #1b1f26, #15181d)",
    "--profile-card-border": "#3b4049",
    "--profile-card-bg": "linear-gradient(180deg, #21252c, #1a1d23)",
    "--profile-card-shadow": "0 16px 40px rgba(9, 11, 15, 0.34)",
    "--profile-banner-overlay": "linear-gradient(180deg, rgba(11, 13, 17, 0.16), rgba(11, 13, 17, 0.42))",
    "--profile-avatar-ring": "#1a1d23",
    "--profile-avatar-shell": "#21252c",
    "--profile-text-main": "#f5f7fa",
    "--profile-text-soft": "#dde1e7",
    "--profile-text-muted": "#b0b6c0",
    "--profile-tag-bg": "rgba(255, 255, 255, 0.1)",
    "--profile-tag-text": "#e8d1a0",
    "--profile-panel-bg": "linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))",
    "--profile-panel-border": "rgba(255, 255, 255, 0.07)",
    "--profile-pill-bg": "#12151a",
    "--profile-pill-text": "#f5f7fa",
    "--profile-icon-bg": "rgba(14, 16, 20, 0.78)",
    "--profile-icon-border": "rgba(255, 255, 255, 0.13)",
    "--profile-overlay": "rgba(7, 8, 10, 0.66)",
  },
  aurora: {
    "--profile-page-text": "#f6fbff",
    "--profile-logo": "#f6fbff",
    "--profile-logo-sub": "#b7d6df",
    "--profile-marquee-border": "#285760",
    "--profile-marquee-bg": "linear-gradient(180deg, #14262a, #0f1b1e)",
    "--profile-card-border": "#2a5a5f",
    "--profile-card-bg": "linear-gradient(135deg, #181423 0%, #152833 45%, #1d3327 100%)",
    "--profile-card-shadow": "0 16px 40px rgba(6, 17, 20, 0.38)",
    "--profile-banner-overlay": "linear-gradient(180deg, rgba(10, 15, 18, 0.08), rgba(6, 10, 13, 0.44))",
    "--profile-avatar-ring": "#182127",
    "--profile-avatar-shell": "#1c2430",
    "--profile-text-main": "#f4fbff",
    "--profile-text-soft": "#d3eef3",
    "--profile-text-muted": "#9fc8cb",
    "--profile-tag-bg": "rgba(225, 255, 242, 0.1)",
    "--profile-tag-text": "#b8ffd7",
    "--profile-panel-bg": "linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.04))",
    "--profile-panel-border": "rgba(223, 255, 248, 0.08)",
    "--profile-pill-bg": "#0e141b",
    "--profile-pill-text": "#f4fbff",
    "--profile-icon-bg": "rgba(8, 12, 16, 0.76)",
    "--profile-icon-border": "rgba(223, 255, 248, 0.14)",
    "--profile-overlay": "rgba(5, 8, 10, 0.66)",
  },
};

const creatorThemeStyles: Record<ProfileTheme, Record<string, string>> = {
  black: {
    "--creator-shell-bg": "linear-gradient(180deg, #11151d, #090d14 100%)",
    "--creator-sidebar-bg": "linear-gradient(180deg, #24314f, #131a2c 100%)",
    "--creator-accent": "#f8d899",
    "--creator-stage-bg": "linear-gradient(180deg, #0d1524, #070c14 100%)",
    "--creator-floor-bg": "linear-gradient(180deg, rgba(248, 216, 153, 0.18), rgba(248, 216, 153, 0.04))",
  },
  white: {
    "--creator-shell-bg": "linear-gradient(180deg, #ffffff, #eef3f8 100%)",
    "--creator-sidebar-bg": "linear-gradient(180deg, #f4efe7, #e3ebf3 100%)",
    "--creator-accent": "#b37a20",
    "--creator-stage-bg": "linear-gradient(180deg, #f8fbff, #e7edf5 100%)",
    "--creator-floor-bg": "linear-gradient(180deg, rgba(179, 122, 32, 0.14), rgba(179, 122, 32, 0.03))",
  },
  red: {
    "--creator-shell-bg": "linear-gradient(180deg, #331116, #18070a 100%)",
    "--creator-sidebar-bg": "linear-gradient(180deg, #5a1d25, #2b0d12 100%)",
    "--creator-accent": "#ffb38a",
    "--creator-stage-bg": "linear-gradient(180deg, #2a0d13, #140509 100%)",
    "--creator-floor-bg": "linear-gradient(180deg, rgba(255, 179, 138, 0.18), rgba(255, 179, 138, 0.04))",
  },
  blue: {
    "--creator-shell-bg": "linear-gradient(180deg, #11203d, #07101f 100%)",
    "--creator-sidebar-bg": "linear-gradient(180deg, #19396f, #102347 100%)",
    "--creator-accent": "#8fd4ff",
    "--creator-stage-bg": "linear-gradient(180deg, #0b1a34, #060d1b 100%)",
    "--creator-floor-bg": "linear-gradient(180deg, rgba(143, 212, 255, 0.2), rgba(143, 212, 255, 0.05))",
  },
  gray: {
    "--creator-shell-bg": "linear-gradient(180deg, #21252d, #111419 100%)",
    "--creator-sidebar-bg": "linear-gradient(180deg, #434b59, #252b35 100%)",
    "--creator-accent": "#e7d8ba",
    "--creator-stage-bg": "linear-gradient(180deg, #1a2028, #0d1015 100%)",
    "--creator-floor-bg": "linear-gradient(180deg, rgba(231, 216, 186, 0.16), rgba(231, 216, 186, 0.04))",
  },
  aurora: {
    "--creator-shell-bg": "linear-gradient(135deg, #171426 0%, #0d2230 48%, #142a20 100%)",
    "--creator-sidebar-bg": "linear-gradient(180deg, #234564, #163127 100%)",
    "--creator-accent": "#9ef5d2",
    "--creator-stage-bg": "linear-gradient(180deg, #0d1c2a, #081210 100%)",
    "--creator-floor-bg": "linear-gradient(180deg, rgba(158, 245, 210, 0.2), rgba(158, 245, 210, 0.05))",
  },
};

function readStoredProfile(): ProfileData {
  if (typeof window === "undefined") {
    return defaultProfile;
  }

  const savedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);

  if (!savedProfile) {
    return defaultProfile;
  }

  try {
    const parsedProfile = JSON.parse(savedProfile) as Partial<ProfileData>;

    return {
      ...defaultProfile,
      ...parsedProfile,
    };
  } catch {
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    return defaultProfile;
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [draft, setDraft] = useState<ProfileData>(defaultProfile);
  const [message, setMessage] = useState(`Message @${defaultProfile.displayName}`);
  const [isEditMounted, setIsEditMounted] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [isBioOpen, setIsBioOpen] = useState(false);

  const currentTheme = {
    ...themeStyles[profile.theme],
    ...creatorThemeStyles[profile.theme],
  };

  useEffect(() => {
    const hydrationTimeout = window.setTimeout(() => {
      const storedProfile = readStoredProfile();
      setProfile(storedProfile);
      setDraft(storedProfile);
      setMessage(`Message @${storedProfile.displayName}`);
    }, 0);

    return () => window.clearTimeout(hydrationTimeout);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const openEditModal = () => {
    setDraft(profile);
    setIsEditMounted(true);
  };

  const closeEditModal = () => {
    setDraft(profile);
    setIsEditVisible(false);
  };

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfile(draft);
    setMessage(`Message @${draft.displayName}`);
    setIsEditVisible(false);
  };

  useEffect(() => {
    if (!isEditMounted) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setIsEditVisible(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isEditMounted]);

  useEffect(() => {
    if (isEditVisible || !isEditMounted) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsEditMounted(false);
    }, 220);

    return () => window.clearTimeout(timeout);
  }, [isEditMounted, isEditVisible]);

  return (
    <div className="route-page profile-theme-page" style={currentTheme as CSSProperties}>
      <SiteHeader />

      <div className="route-shell profile-modern-shell">
        <SiteNav variant="profile" />
        <div className="profile-content-grid">
          <section className="profile-modern-card">
            <div
              className="profile-modern-banner"
              style={{
                backgroundImage: `${currentTheme["--profile-banner-overlay"]}, url("${profile.bannerImage}")`,
              }}
            >
              <div className="profile-banner-actions" aria-label="Profile actions">
                <button type="button" className="profile-icon-action" aria-label="Add friend">
                  +
                </button>
                <button type="button" className="profile-icon-action" aria-label="Open profile editor" onClick={openEditModal}>
                  ...
                </button>
              </div>
            </div>

            <div className="profile-modern-body">
              <div className="profile-modern-avatar-wrap">
                <button
                  type="button"
                  className="profile-modern-avatar-button"
                  aria-label="Open profile editor"
                  onClick={openEditModal}
                >
                  <div className="profile-modern-avatar-frame">
                    <Image
                      src={profile.profileImage}
                      alt={`${profile.displayName} profile picture`}
                      width={240}
                      height={240}
                      className="profile-modern-avatar"
                      unoptimized
                    />
                  </div>
                </button>
                <span className="profile-modern-status" aria-hidden="true" />
              </div>

              <div className="profile-modern-identity">
                <h1 className="profile-modern-name">{profile.displayName}</h1>
                <div className="profile-modern-meta-row">
                  <span className="profile-modern-handle">{profile.username}</span>
                  <span className="profile-modern-tag">IRL</span>
                  <span
                    className="profile-modern-tag"
                    style={{
                      color: profile.affiliationTextColor,
                      background: profile.affiliationBoxColor,
                    }}
                  >
                    {profile.affiliation}
                  </span>
                </div>

                <div className="profile-modern-socials" aria-label="Earned icons and badges">
                  {socialBadges.map((badge) => (
                    <span key={badge.label} className={`profile-social-badge ${badge.colorClass}`} title={badge.label}>
                      <span
                        className="profile-badge-icon profile-badge-image"
                        style={{ backgroundImage: `url("${badge.iconUrl}")` }}
                        aria-hidden="true"
                      />
                    </span>
                  ))}
                </div>

                <button type="button" className="profile-text-link" onClick={() => setIsBioOpen(true)}>
                  View Full Bio
                </button>

                <p className="profile-modern-description">{profile.description}</p>

                <section className="profile-modern-panel">
                  <div className="profile-panel-head">
                    <span>Game Collection</span>
                    <div className="profile-game-grid" aria-label="Collected games">
                      {gameCollection.map((game) => (
                        <span key={game} className="profile-game-pill">
                          {game}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>

                <form
                  className="profile-modern-message"
                  onSubmit={(event) => {
                    event.preventDefault();
                  }}
                >
                  <input
                    type="text"
                    className="profile-modern-input"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    aria-label={`Message ${profile.displayName}`}
                  />
                  <button type="submit" className="profile-message-emoji" aria-label="Open emoji picker">
                    :)
                  </button>
                </form>
              </div>
            </div>
          </section>

          <CreateASlop />
        </div>
      </div>

      {isEditMounted ? (
        <div
          className={`profile-modal-overlay${isEditVisible ? " is-visible" : ""}`}
          role="presentation"
          onClick={closeEditModal}
        >
          <div
            className="profile-modal-card profile-editor-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-editor-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="profile-modal-head">
              <button type="button" className="profile-modal-close" onClick={closeEditModal} aria-label="Close profile editor">
                X
              </button>
              <div>
                <p className="profile-modal-kicker">Profile Settings</p>
                <h2 id="profile-editor-title" className="profile-modal-title">
                  Edit Your Profile
                </h2>
              </div>
            </div>

            <form className="profile-editor-form" onSubmit={saveProfile}>
              <label className="profile-editor-field">
                <span>Profile Image URL</span>
                <input
                  type="url"
                  className="profile-editor-input"
                  value={draft.profileImage}
                  onChange={(event) => setDraft((current) => ({ ...current, profileImage: event.target.value }))}
                />
              </label>

              <label className="profile-editor-field">
                <span>Banner Image URL</span>
                <input
                  type="url"
                  className="profile-editor-input"
                  value={draft.bannerImage}
                  onChange={(event) => setDraft((current) => ({ ...current, bannerImage: event.target.value }))}
                />
              </label>

              <div className="profile-editor-grid">
                <label className="profile-editor-field">
                  <span>Display Name</span>
                  <input
                    type="text"
                    className="profile-editor-input"
                    value={draft.displayName}
                    onChange={(event) => setDraft((current) => ({ ...current, displayName: event.target.value }))}
                  />
                </label>

                <label className="profile-editor-field">
                  <span>User Name</span>
                  <input
                    type="text"
                    className="profile-editor-input"
                    value={draft.username}
                    onChange={(event) => setDraft((current) => ({ ...current, username: event.target.value }))}
                  />
                </label>
              </div>

              <label className="profile-editor-field">
                <span>Description</span>
                <textarea
                  className="profile-editor-textarea"
                  value={draft.description}
                  onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                />
              </label>

              <div className="profile-editor-grid">
                <label className="profile-editor-field">
                  <span>Affiliation</span>
                  <input
                    type="text"
                    className="profile-editor-input"
                    value={draft.affiliation}
                    onChange={(event) => setDraft((current) => ({ ...current, affiliation: event.target.value }))}
                  />
                </label>

                <label className="profile-editor-field">
                  <span>Affiliation Text Color</span>
                  <input
                    type="text"
                    className="profile-editor-input"
                    value={draft.affiliationTextColor}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, affiliationTextColor: event.target.value }))
                    }
                  />
                </label>
              </div>

              <label className="profile-editor-field">
                <span>Affiliation Box Color</span>
                <input
                  type="text"
                  className="profile-editor-input"
                  value={draft.affiliationBoxColor}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, affiliationBoxColor: event.target.value }))
                  }
                />
              </label>

              <fieldset className="profile-editor-theme-group">
                <legend>Profile Theme</legend>
                <div className="profile-theme-options">
                  {(Object.keys(themeStyles) as ProfileTheme[]).map((theme) => (
                    <label key={theme} className={`profile-theme-option${draft.theme === theme ? " is-active" : ""}`}>
                      <input
                        type="radio"
                        name="profile-theme"
                        value={theme}
                        checked={draft.theme === theme}
                        onChange={() => setDraft((current) => ({ ...current, theme }))}
                      />
                      <span>{theme}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="profile-editor-actions">
                <button type="button" className="profile-secondary-button" onClick={closeEditModal}>
                  Cancel
                </button>
                <button type="submit" className="profile-primary-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isBioOpen ? (
        <div className="profile-modal-overlay" role="presentation" onClick={() => setIsBioOpen(false)}>
          <div
            className="profile-modal-card profile-bio-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-bio-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="profile-modal-head">
              <div>
                <p className="profile-modal-kicker">Full Bio</p>
                <h2 id="profile-bio-title" className="profile-modal-title">
                  {profile.displayName}
                </h2>
              </div>
              <button type="button" className="profile-modal-close" onClick={() => setIsBioOpen(false)} aria-label="Close full bio">
                X
              </button>
            </div>
            <p className="profile-bio-copy">{profile.description}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
