import Image from "next/image";
import { type ProfileData } from "../../lib/accountData";

type SlopHudProps = {
  profile: ProfileData;
  coins: number;
  onProfileClick?: () => void;
};

export default function SlopHud({ profile, coins, onProfileClick }: SlopHudProps) {
  return (
    <div className="slop-hud">
      <button type="button" className="slop-hud-profile" onClick={onProfileClick} aria-label="Open profile">
        <div className="slop-hud-avatar">
          <Image src={profile.profileImage} alt={profile.displayName} fill unoptimized className="slop-hud-avatar-image" />
        </div>
        <div className="slop-hud-copy">
          <span className="slop-hud-kicker">Profile</span>
          <strong>{profile.displayName}</strong>
          <span>{profile.username.toUpperCase()}</span>
        </div>
      </button>

      <div className="slop-hud-rail">
        <div className="slop-hud-coins">
          <span className="slop-hud-coin-icon" aria-hidden="true">
            ★
          </span>
          <strong>{coins.toLocaleString()}</strong>
        </div>
        <div className="slop-hud-actions" aria-label="Window actions">
          <button type="button" className="slop-hud-action" aria-label="Add coins">
            +
          </button>
          <button type="button" className="slop-hud-action" aria-label="Minimize">
            −
          </button>
          <button type="button" className="slop-hud-action" aria-label="Close">
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
