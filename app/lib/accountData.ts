import { defaultCharacterConfig, type CharacterConfig } from "../components/slopOptions";
import { COINS_STORAGE_KEY, WHITE_TRAIL_STORAGE_KEY } from "./siteData";

export type ProfileTheme = "black" | "white" | "red" | "blue" | "gray" | "aurora";

export type ProfileData = {
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

export type AccountEconomy = {
  coins: number;
  gems: number;
};

export type AccountProgression = {
  level: number;
  xp: number;
  xpToNextLevel: number;
};

export type AccountUnlocks = {
  whiteTrailEnabled: boolean;
};

export type AccountOnboarding = {
  needsProfileSetup: boolean;
  hasSeenWelcome: boolean;
};

export type AccountData = {
  profile: ProfileData;
  characterConfig: CharacterConfig;
  economy: AccountEconomy;
  progression: AccountProgression;
  unlocks: AccountUnlocks;
  onboarding: AccountOnboarding;
};

export const ACCOUNT_SESSION_STORAGE_KEY = "slop-list-session";
export const ACCOUNT_SAVE_STORAGE_KEY = "slop-list-account-save";
export const LEGACY_PROFILE_STORAGE_KEY = "slop-list-profile-settings";
export const DEMO_LOGIN_EMAIL = "test@gmail.com";
export const DEMO_LOGIN_PASSWORD = "test123";

export const defaultProfile: ProfileData = {
  profileImage: "https://i.redd.it/6c8d5tlwsfpb1.jpg",
  bannerImage:
    "https://as1.ftcdn.net/v2/jpg/05/22/33/10/1000_F_522331099_Ha6ktAQY8ghcAR8PAqAqeKZZLRPm5g5W.jpg",
  displayName: "Aerial Ace",
  username: "5staralex",
  description: "Top slop sargent.",
  affiliation: "Jitty Boys",
  affiliationTextColor: "#f8d899",
  affiliationBoxColor: "rgba(255, 248, 230, 0.1)",
  theme: "black",
};

export function createDefaultAccountData(): AccountData {
  return {
    profile: defaultProfile,
    characterConfig: defaultCharacterConfig,
    economy: {
      coins: 0,
      gems: 0,
    },
    progression: {
      level: 0,
      xp: 0,
      xpToNextLevel: 100,
    },
    unlocks: {
      whiteTrailEnabled: false,
    },
    onboarding: {
      needsProfileSetup: true,
      hasSeenWelcome: false,
    },
  };
}

export function sanitizeAccountData(value: Partial<AccountData> | null | undefined): AccountData {
  const defaults = createDefaultAccountData();

  return {
    ...defaults,
    ...value,
    profile: {
      ...defaults.profile,
      ...value?.profile,
    },
    characterConfig: {
      ...defaults.characterConfig,
      ...value?.characterConfig,
    },
    economy: {
      ...defaults.economy,
      ...value?.economy,
    },
    progression: {
      ...defaults.progression,
      ...value?.progression,
    },
    unlocks: {
      ...defaults.unlocks,
      ...value?.unlocks,
    },
    onboarding: {
      ...defaults.onboarding,
      ...value?.onboarding,
    },
  };
}

export function readLegacyAccountData(): Partial<AccountData> {
  if (typeof window === "undefined") {
    return {};
  }

  const nextData: Partial<AccountData> = {};

  const storedProfile = window.localStorage.getItem(LEGACY_PROFILE_STORAGE_KEY);
  if (storedProfile) {
    try {
      nextData.profile = {
        ...defaultProfile,
        ...(JSON.parse(storedProfile) as Partial<ProfileData>),
      };
      nextData.onboarding = {
        needsProfileSetup: false,
        hasSeenWelcome: true,
      };
    } catch {
      window.localStorage.removeItem(LEGACY_PROFILE_STORAGE_KEY);
    }
  }

  const storedCoins = Number(window.localStorage.getItem(COINS_STORAGE_KEY) ?? "0");
  const whiteTrailEnabled = window.localStorage.getItem(WHITE_TRAIL_STORAGE_KEY) === "true";

  if (Number.isFinite(storedCoins) && storedCoins > 0) {
    nextData.economy = {
      coins: storedCoins,
      gems: 0,
    };
  }

  if (whiteTrailEnabled) {
    nextData.unlocks = {
      whiteTrailEnabled: true,
    };
  }

  return nextData;
}
