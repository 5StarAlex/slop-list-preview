import { defaultCharacterConfig, type CharacterConfig } from "../components/slopOptions";
import { type SiteBackground } from "./accountData";

export type PlatformPostType = "post" | "meme" | "discussion" | "show-review" | "character-showcase" | "game-score";

export type PublicUser = {
  id: string;
  username: string;
  displayName: string;
  profileImage: string;
  affiliation: string;
  siteBackground: SiteBackground;
  characterConfig: CharacterConfig;
  coins: number;
  level: number;
  xp: number;
};

export type CommunityPost = {
  id: string;
  type: PlatformPostType;
  authorId: string;
  title: string;
  body: string;
  createdAt: string;
  reactions: number;
  comments: number;
  score?: number;
  tag: string;
  imageUrl?: string;
  imageDataUrl?: string;
  gifUrl?: string;
  poll?: string[];
  spoiler?: boolean;
};

export type SlopContestEntry = {
  id: string;
  userId: string;
  rank: number;
  score: number;
  pitch: string;
};

export type PlatformGame = {
  slug: string;
  title: string;
  engine: "canvas" | "phaser";
  status: "ready" | "prototype" | "planned";
  rewardRule: string;
  leaderboard: Array<{ userId: string; score: number }>;
};

export const platformUsers: PublicUser[] = [
  {
    id: "user-aerial-ace",
    username: "5staralex",
    displayName: "Aerial Ace",
    profileImage: "https://i.redd.it/6c8d5tlwsfpb1.jpg",
    affiliation: "Jitty Boys",
    siteBackground: "main",
    characterConfig: defaultCharacterConfig,
    coins: 15230,
    level: 12,
    xp: 840,
  },
  {
    id: "user-neon-glitch",
    username: "neonglitch",
    displayName: "NeonGlitch",
    profileImage: "https://cdn.myanimelist.net/images/characters/6/284121.jpg",
    affiliation: "Arcade Union",
    siteBackground: "arcade",
    characterConfig: { ...defaultCharacterConfig, color: 4, shirt: 2, pants: 1, accessories: 2 },
    coins: 13420,
    level: 10,
    xp: 620,
  },
  {
    id: "user-pixel-punk",
    username: "pixelpunk",
    displayName: "PixelPunk",
    profileImage: "https://cdn.myanimelist.net/images/characters/3/278753.jpg",
    affiliation: "Feed Mods",
    siteBackground: "synth",
    characterConfig: { ...defaultCharacterConfig, color: 3, eyes: 1, mouth: 2, shirt: 3 },
    coins: 11090,
    level: 9,
    xp: 440,
  },
];

export const platformPosts: CommunityPost[] = [
  {
    id: "post-king-entry",
    type: "character-showcase",
    authorId: "user-aerial-ace",
    title: "Submitting my current slop for the crown",
    body: "New fit, same attitude. If this hits King of Slop, the arcade gets the victory lap.",
    createdAt: "2m ago",
    reactions: 184,
    comments: 36,
    tag: "King of Slop",
    spoiler: false,
  },
  {
    id: "post-game-score",
    type: "game-score",
    authorId: "user-neon-glitch",
    title: "Runner prototype score check",
    body: "Avatar loading works, score posts to the feed, and the next pass needs obstacle variety.",
    createdAt: "18m ago",
    reactions: 92,
    comments: 14,
    score: 13420,
    tag: "Arcade",
    spoiler: false,
  },
  {
    id: "post-watchlist",
    type: "show-review",
    authorId: "user-pixel-punk",
    title: "Frieren shelf is still the soft fantasy standard",
    body: "The catalog modal finally gives the poster room to breathe. Saved it to my public watch list.",
    createdAt: "1h ago",
    reactions: 67,
    comments: 11,
    tag: "Catalog",
    poll: ["Frieren", "Apothecary Diaries"],
    spoiler: false,
  },
];

export const kingOfSlopEntries: SlopContestEntry[] = [
  { id: "entry-aerial", userId: "user-aerial-ace", rank: 1, score: 15230, pitch: "A clean main-character profile with enough slop energy to hold the throne." },
  { id: "entry-neon", userId: "user-neon-glitch", rank: 2, score: 13420, pitch: "Arcade colors, sharp movement, and a leaderboard menace." },
  { id: "entry-pixel", userId: "user-pixel-punk", rank: 3, score: 11090, pitch: "Community feed regular with elite catalog taste." },
];

export const platformGames: PlatformGame[] = [
  {
    slug: "slop-runner",
    title: "Slop Runner",
    engine: "canvas",
    status: "ready",
    rewardRule: "1 star per 150 points, capped at 75 stars per verified run.",
    leaderboard: [
      { userId: "user-neon-glitch", score: 13420 },
      { userId: "user-aerial-ace", score: 12180 },
      { userId: "user-pixel-punk", score: 9840 },
    ],
  },
  {
    slug: "tag-game",
    title: "Tag Game",
    engine: "phaser",
    status: "prototype",
    rewardRule: "Win rounds for XP; streaks unlock cosmetic drops.",
    leaderboard: [
      { userId: "user-aerial-ace", score: 8880 },
      { userId: "user-pixel-punk", score: 7310 },
    ],
  },
];

export const platformSchemaChecklist = [
  "users + auth_accounts store identity, provider ids, password hashes, roles, and account status.",
  "user_profiles, character_configs, user_economies, and user_inventory_items hold personal persistent data.",
  "shows and watchlist_items replace browser-only catalog state.",
  "posts, comments, reactions, and moderation_reports power public UGC.",
  "slop_contests, slop_contest_entries, and slop_contest_votes power King of Slop.",
  "games, game_sessions, and game_scores connect HTML5 games to avatars, rewards, and leaderboards.",
] as const;

export function getUserById(userId: string) {
  return platformUsers.find((user) => user.id === userId) ?? platformUsers[0];
}

export function getGameBySlug(slug: string) {
  return platformGames.find((game) => game.slug === slug) ?? platformGames[0];
}
