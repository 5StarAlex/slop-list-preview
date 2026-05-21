"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useAccount } from "./AccountProvider";
import SlopTitle from "./SlopTitle";
import { DEMO_LOGIN_EMAIL, DEMO_LOGIN_PASSWORD, defaultProfile, type ProfileData, type ProfileTheme } from "../lib/accountData";

const themeSwatches: Record<ProfileTheme, string> = {
  black: "linear-gradient(135deg, #181b26, #06070b)",
  white: "linear-gradient(135deg, #ffffff, #dde6f0)",
  red: "linear-gradient(135deg, #5b1820, #170609)",
  blue: "linear-gradient(135deg, #16365f, #07101f)",
  gray: "linear-gradient(135deg, #414854, #12161b)",
  aurora: "linear-gradient(135deg, #224660, #153224)",
};

const CLOSE_ANIMATION_MS = 180;

export default function GlobalProfileWidget() {
  const { isAuthenticated, account, login, logout, updateProfile, completeProfileSetup } = useAccount();
  const profile = account.profile;
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileData>(defaultProfile);
  const [authEmail, setAuthEmail] = useState(DEMO_LOGIN_EMAIL);
  const [authPassword, setAuthPassword] = useState(DEMO_LOGIN_PASSWORD);
  const [authError, setAuthError] = useState("");

  const needsSetup = isAuthenticated && account.onboarding.needsProfileSetup;
  const profileThemeStyle = useMemo(() => ({ background: themeSwatches[profile.theme] }), [profile.theme]);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  useEffect(() => {
    if (!isMounted || isVisible) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsMounted(false);
    }, CLOSE_ANIMATION_MS);

    return () => window.clearTimeout(timeout);
  }, [isMounted, isVisible]);

  useEffect(() => {
    if (needsSetup) {
      setDraft(profile);
      setIsEditing(true);
      setIsMounted(true);
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, [needsSetup, profile]);

  const openModal = () => {
    setDraft(profile);
    setIsMounted(true);
    requestAnimationFrame(() => setIsVisible(true));
  };

  const closeModal = () => {
    setIsVisible(false);
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = login(authEmail, authPassword);

    if (!result.ok) {
      setAuthError(result.error ?? "Unable to sign in.");
      return;
    }

    setAuthError("");
  };

  const onProfileImageUpload: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setDraft((current) => ({ ...current, profileImage: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (needsSetup) {
      completeProfileSetup(draft);
    } else {
      updateProfile(draft);
    }

    setIsEditing(false);
    closeModal();
  };

  const modalContent = isMounted ? (
    <div
      className={`global-profile-modal-overlay${isVisible ? " is-visible" : ""}`}
      role="presentation"
      onClick={closeModal}
    >
      <div
        className={`global-profile-modal pixel-profile-modal${isVisible ? " is-visible" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="global-profile-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="global-profile-modal-head">
          <div>
            <p className="global-profile-modal-kicker">{isAuthenticated ? "Profile" : "Demo Login"}</p>
            <SlopTitle as="h2" size="md" className="global-profile-modal-title" id="global-profile-modal-title">
              {isAuthenticated ? "Your Slop Profile" : "Unlock Your Save"}
            </SlopTitle>
          </div>

          <button type="button" className="global-profile-modal-close" onClick={closeModal} aria-label="Close profile panel">
            X
          </button>
        </div>

        {!isAuthenticated ? (
          <form className="global-profile-auth-form" onSubmit={handleLogin}>
            <p className="global-profile-helper-copy">
              Use the prototype account to unlock the builder, inventory, stats, and saved profile changes everywhere.
            </p>

            <label className="global-profile-field">
              <span>Email</span>
              <input
                type="email"
                className="global-profile-input"
                value={authEmail}
                onChange={(event) => setAuthEmail(event.target.value)}
              />
            </label>

            <label className="global-profile-field">
              <span>Password</span>
              <input
                type="password"
                className="global-profile-input"
                value={authPassword}
                onChange={(event) => setAuthPassword(event.target.value)}
              />
            </label>

            <p className="global-profile-helper-copy">Demo login: {DEMO_LOGIN_EMAIL} / {DEMO_LOGIN_PASSWORD}</p>
            {authError ? <p className="global-profile-error">{authError}</p> : null}

            <div className="global-profile-actions">
              <button type="submit" className="global-profile-primary">
                Enter Profile
              </button>
            </div>
          </form>
        ) : isEditing ? (
          <form className="global-profile-editor" onSubmit={handleSave}>
            <div className="global-profile-editor-grid">
              <label className="global-profile-field">
                <span>Display Name</span>
                <input
                  type="text"
                  className="global-profile-input"
                  value={draft.displayName}
                  onChange={(event) => setDraft((current) => ({ ...current, displayName: event.target.value }))}
                />
              </label>

              <label className="global-profile-field">
                <span>User Name</span>
                <input
                  type="text"
                  className="global-profile-input"
                  value={draft.username}
                  onChange={(event) => setDraft((current) => ({ ...current, username: event.target.value }))}
                />
              </label>
            </div>

            <label className="global-profile-field">
              <span>Profile Image URL</span>
              <input
                type="url"
                className="global-profile-input"
                value={draft.profileImage}
                onChange={(event) => setDraft((current) => ({ ...current, profileImage: event.target.value }))}
              />
            </label>

            <label className="global-profile-field">
              <span>Upload Profile Image</span>
              <input type="file" accept="image/*" className="global-profile-input" onChange={onProfileImageUpload} />
            </label>

            <label className="global-profile-field">
              <span>Banner Image URL</span>
              <input
                type="url"
                className="global-profile-input"
                value={draft.bannerImage}
                onChange={(event) => setDraft((current) => ({ ...current, bannerImage: event.target.value }))}
              />
            </label>

            <label className="global-profile-field">
              <span>Affiliation</span>
              <input
                type="text"
                className="global-profile-input"
                value={draft.affiliation}
                onChange={(event) => setDraft((current) => ({ ...current, affiliation: event.target.value }))}
              />
            </label>

            <label className="global-profile-field">
              <span>Description</span>
              <textarea
                className="global-profile-textarea"
                value={draft.description}
                onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
              />
            </label>

            <fieldset className="global-profile-theme-row">
              <legend>Theme</legend>
              <div className="global-profile-theme-options">
                {(Object.keys(themeSwatches) as ProfileTheme[]).map((theme) => (
                  <label key={theme} className={`global-profile-theme-option${draft.theme === theme ? " is-active" : ""}`}>
                    <input
                      type="radio"
                      name="global-profile-theme"
                      checked={draft.theme === theme}
                      onChange={() => setDraft((current) => ({ ...current, theme }))}
                    />
                    <span>{theme}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="global-profile-field">
              <span>
                <input
                  type="checkbox"
                  checked={draft.darkMode}
                  onChange={(event) => setDraft((current) => ({ ...current, darkMode: event.target.checked }))}
                />{" "}
                Dark mode
              </span>
            </label>

            <label className="global-profile-field">
              <span>
                <input
                  type="checkbox"
                  checked={draft.glossyMode}
                  onChange={(event) => setDraft((current) => ({ ...current, glossyMode: event.target.checked }))}
                />{" "}
                iOS glossy mode
              </span>
            </label>

            <div className="global-profile-actions">
              <button type="button" className="global-profile-secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="global-profile-primary">
                Save Profile
              </button>
            </div>
          </form>
        ) : (
          <div className="global-profile-panel">
            <div
              className="global-profile-banner"
              style={{ backgroundImage: `linear-gradient(180deg, rgba(10, 13, 26, 0.12), rgba(10, 13, 26, 0.7)), url("${profile.bannerImage}")` }}
            />

            <div className="global-profile-summary">
              <div className="global-profile-avatar-shell" style={profileThemeStyle}>
                <Image src={profile.profileImage} alt={`${profile.displayName} avatar`} fill unoptimized className="global-profile-avatar-image" />
              </div>

              <div className="global-profile-summary-copy">
                <SlopTitle as="h3" size="sm" className="global-profile-name">{profile.displayName}</SlopTitle>
                <p className="global-profile-handle">{profile.username}</p>
                <p className="global-profile-affiliation">{profile.affiliation}</p>
              </div>
            </div>

            <p className="global-profile-description">{profile.description}</p>

            <div className="global-profile-stat-grid">
              <div className="global-profile-stat-card">
                <span>Coins</span>
                <strong>{account.economy.coins}</strong>
              </div>
              <div className="global-profile-stat-card">
                <span>Gems</span>
                <strong>{account.economy.gems}</strong>
              </div>
              <div className="global-profile-stat-card">
                <span>Level</span>
                <strong>{account.progression.level}</strong>
              </div>
            </div>

            <div className="global-profile-actions">
              <button type="button" className="global-profile-secondary" onClick={logout}>
                Log Out
              </button>
              <button type="button" className="global-profile-primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button type="button" className="global-profile-widget" aria-label="Open profile panel" onClick={openModal}>
        <span className="global-profile-widget-rail" aria-hidden="true" />
        <div className="global-profile-widget-art" style={profileThemeStyle}>
          <Image src={profile.profileImage} alt={`${profile.displayName} avatar`} fill unoptimized className="global-profile-widget-image" />
        </div>
        <div className="global-profile-widget-copy">
          <span className="global-profile-widget-kicker">{isAuthenticated ? "Profile" : "Sign In"}</span>
          <strong>{isAuthenticated ? profile.displayName : "Demo Account"}</strong>
          <span>{isAuthenticated ? profile.username : "Open your profile hub"}</span>
        </div>
        <span className="global-profile-widget-status" aria-hidden="true" />
      </button>
      {typeof document !== "undefined" && modalContent ? createPortal(modalContent, document.body) : null}
    </>
  );
}
