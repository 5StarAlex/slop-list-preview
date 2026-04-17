"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ACCOUNT_SAVE_STORAGE_KEY,
  ACCOUNT_SESSION_STORAGE_KEY,
  type AccountData,
  type ProfileData,
  createDefaultAccountData,
  readLegacyAccountData,
  sanitizeAccountData,
} from "../lib/accountData";
import { validateDemoCredentials } from "../lib/fakeAuth";
import { COINS_EVENT_NAME, SHOP_EVENT_NAME } from "../lib/siteData";
import { type CharacterConfig } from "./slopOptions";

type AccountSession = {
  email: string;
};

type LoginResult = {
  ok: boolean;
  error?: string;
};

type AccountContextValue = {
  isHydrated: boolean;
  isAuthenticated: boolean;
  sessionEmail: string | null;
  account: AccountData;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
  updateProfile: (profile: ProfileData) => void;
  updateCharacterConfig: (config: CharacterConfig) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  setGems: (amount: number) => void;
  setWhiteTrailEnabled: (enabled: boolean) => void;
  completeProfileSetup: (profile: ProfileData) => void;
  dismissWelcome: () => void;
};

const AccountContext = createContext<AccountContextValue | null>(null);

function readStoredSession(): AccountSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(ACCOUNT_SESSION_STORAGE_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(rawSession) as Partial<AccountSession>;
    return parsedSession.email ? { email: parsedSession.email } : null;
  } catch {
    window.localStorage.removeItem(ACCOUNT_SESSION_STORAGE_KEY);
    return null;
  }
}

function readStoredAccount(): AccountData {
  if (typeof window === "undefined") {
    return createDefaultAccountData();
  }

  const rawAccount = window.localStorage.getItem(ACCOUNT_SAVE_STORAGE_KEY);
  if (!rawAccount) {
    return sanitizeAccountData(readLegacyAccountData());
  }

  try {
    const parsedAccount = JSON.parse(rawAccount) as Partial<AccountData>;
    return sanitizeAccountData(parsedAccount);
  } catch {
    window.localStorage.removeItem(ACCOUNT_SAVE_STORAGE_KEY);
    return sanitizeAccountData(readLegacyAccountData());
  }
}

export default function AccountProvider({ children }: { children: ReactNode }) {
  const [isHydrated] = useState(() => typeof window !== "undefined");
  const [session, setSession] = useState<AccountSession | null>(() => readStoredSession());
  const [account, setAccount] = useState<AccountData>(() => readStoredAccount());

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(ACCOUNT_SAVE_STORAGE_KEY, JSON.stringify(account));
  }, [account, isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (session) {
      window.localStorage.setItem(ACCOUNT_SESSION_STORAGE_KEY, JSON.stringify(session));
      return;
    }

    window.localStorage.removeItem(ACCOUNT_SESSION_STORAGE_KEY);
  }, [isHydrated, session]);

  const value = useMemo<AccountContextValue>(
    () => ({
      isHydrated,
      isAuthenticated: Boolean(session),
      sessionEmail: session?.email ?? null,
      account,
      login(email, password) {
        if (!validateDemoCredentials(email, password)) {
          return {
            ok: false,
            error: "Use test@gmail.com and test123 to sign in to the prototype account.",
          };
        }

        setSession({ email: email.trim().toLowerCase() });
        return { ok: true };
      },
      logout() {
        setSession(null);
      },
      updateProfile(profile) {
        setAccount((current) => ({
          ...current,
          profile,
        }));
      },
      updateCharacterConfig(config) {
        setAccount((current) => ({
          ...current,
          characterConfig: config,
        }));
      },
      addCoins(amount) {
        if (amount <= 0) {
          return;
        }

        setAccount((current) => {
          const nextCoins = current.economy.coins + amount;
          window.dispatchEvent(new CustomEvent(COINS_EVENT_NAME, { detail: { amount, total: nextCoins } }));
          return {
            ...current,
            economy: {
              ...current.economy,
              coins: nextCoins,
            },
          };
        });
      },
      spendCoins(amount) {
        let didSpend = false;

        setAccount((current) => {
          if (amount <= 0 || current.economy.coins < amount) {
            return current;
          }

          didSpend = true;
          const nextCoins = current.economy.coins - amount;
          window.dispatchEvent(new CustomEvent(COINS_EVENT_NAME, { detail: { amount: 0, total: nextCoins } }));

          return {
            ...current,
            economy: {
              ...current.economy,
              coins: nextCoins,
            },
          };
        });

        return didSpend;
      },
      setGems(amount) {
        setAccount((current) => ({
          ...current,
          economy: {
            ...current.economy,
            gems: Math.max(0, amount),
          },
        }));
      },
      setWhiteTrailEnabled(enabled) {
        setAccount((current) => ({
          ...current,
          unlocks: {
            ...current.unlocks,
            whiteTrailEnabled: enabled,
          },
        }));
        window.dispatchEvent(new CustomEvent(SHOP_EVENT_NAME));
      },
      completeProfileSetup(profile) {
        setAccount((current) => ({
          ...current,
          profile,
          onboarding: {
            needsProfileSetup: false,
            hasSeenWelcome: false,
          },
        }));
      },
      dismissWelcome() {
        setAccount((current) => ({
          ...current,
          onboarding: {
            ...current.onboarding,
            hasSeenWelcome: true,
          },
        }));
      },
    }),
    [account, isHydrated, session],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error("useAccount must be used inside AccountProvider.");
  }

  return context;
}
