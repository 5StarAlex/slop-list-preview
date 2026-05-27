-- Slop List platform schema.
-- Target database: PostgreSQL 15+.
-- Auth can be handled by Auth.js, Supabase Auth, Clerk, or a custom provider.
-- If using an external auth provider, keep auth_accounts.provider_user_id mapped
-- to that provider's stable user id and leave password_hash null.

create extension if not exists "pgcrypto";

create type user_role as enum ('USER', 'MODERATOR', 'ADMIN');
create type user_status as enum ('ACTIVE', 'SUSPENDED', 'BANNED');
create type post_type as enum ('POST', 'MEME', 'DISCUSSION', 'SHOW_REVIEW', 'CHARACTER_SHOWCASE', 'GAME_SCORE');
create type post_visibility as enum ('PUBLIC', 'FOLLOWERS', 'PRIVATE', 'HIDDEN');
create type reaction_type as enum ('LIKE', 'STAR', 'LAUGH', 'FIRE', 'SLOP');
create type transaction_type as enum ('EARNED', 'SPENT', 'ADMIN_ADJUSTMENT', 'REFUND');
create type contest_status as enum ('DRAFT', 'OPEN', 'VOTING', 'CLOSED', 'ARCHIVED');
create type moderation_status as enum ('OPEN', 'REVIEWING', 'RESOLVED', 'DISMISSED');

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  username text not null unique,
  display_name text not null,
  role user_role not null default 'USER',
  status user_status not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table auth_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  provider text not null default 'credentials',
  provider_user_id text,
  password_hash text,
  email_verified_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, provider_user_id),
  constraint auth_credentials_need_secret check (
    provider <> 'credentials' or password_hash is not null
  )
);

create table user_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  bio text not null default '',
  avatar_image_url text,
  banner_image_url text,
  affiliation text,
  profile_theme text not null default 'black',
  site_background text not null default 'main',
  dark_mode boolean not null default false,
  glossy_mode boolean not null default false,
  is_watchlist_public boolean not null default true,
  is_inventory_public boolean not null default true,
  updated_at timestamptz not null default now()
);

create table character_configs (
  user_id uuid primary key references users(id) on delete cascade,
  config jsonb not null,
  equipped_item_ids text[] not null default '{}',
  preview_image_url text,
  updated_at timestamptz not null default now()
);

create table user_economies (
  user_id uuid primary key references users(id) on delete cascade,
  coins integer not null default 0 check (coins >= 0),
  gems integer not null default 0 check (gems >= 0),
  xp integer not null default 0 check (xp >= 0),
  level integer not null default 0 check (level >= 0),
  updated_at timestamptz not null default now()
);

create table economy_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type transaction_type not null,
  coin_delta integer not null default 0,
  gem_delta integer not null default 0,
  xp_delta integer not null default 0,
  reason text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table shop_items (
  id text primary key,
  name text not null,
  slot text not null,
  rarity text not null default 'COMMON',
  price_coins integer not null default 0 check (price_coins >= 0),
  metadata jsonb not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table user_inventory_items (
  user_id uuid not null references users(id) on delete cascade,
  item_id text not null references shop_items(id),
  acquired_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create table shows (
  id uuid primary key default gen_random_uuid(),
  external_source text,
  external_id text,
  title text not null,
  poster_url text,
  synopsis text,
  score numeric(4, 2),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique (external_source, external_id)
);

create table watchlist_items (
  user_id uuid not null references users(id) on delete cascade,
  show_id uuid not null references shows(id) on delete cascade,
  status text not null default 'PLANNED',
  user_rating integer check (user_rating between 1 and 10),
  notes text,
  added_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, show_id)
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references users(id) on delete cascade,
  type post_type not null default 'POST',
  visibility post_visibility not null default 'PUBLIC',
  title text not null,
  body text not null default '',
  image_url text,
  gif_url text,
  show_id uuid references shows(id) on delete set null,
  character_snapshot jsonb,
  game_slug text,
  score integer,
  is_spoiler boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_id uuid not null references users(id) on delete cascade,
  parent_comment_id uuid references comments(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  post_id uuid references posts(id) on delete cascade,
  comment_id uuid references comments(id) on delete cascade,
  type reaction_type not null,
  created_at timestamptz not null default now(),
  unique (user_id, post_id, type),
  unique (user_id, comment_id, type),
  constraint reaction_target check (
    (post_id is not null and comment_id is null)
    or (post_id is null and comment_id is not null)
  )
);

create table slop_contests (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  status contest_status not null default 'DRAFT',
  starts_at timestamptz,
  voting_ends_at timestamptz,
  winner_entry_id uuid,
  created_at timestamptz not null default now()
);

create table slop_contest_entries (
  id uuid primary key default gen_random_uuid(),
  contest_id uuid not null references slop_contests(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  character_snapshot jsonb not null,
  pitch text not null default '',
  score integer not null default 0,
  created_at timestamptz not null default now(),
  unique (contest_id, user_id)
);

alter table slop_contests
  add constraint slop_contests_winner_entry_fk
  foreign key (winner_entry_id) references slop_contest_entries(id) on delete set null;

create table slop_contest_votes (
  contest_id uuid not null references slop_contests(id) on delete cascade,
  entry_id uuid not null references slop_contest_entries(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (contest_id, user_id)
);

create table games (
  slug text primary key,
  title text not null,
  engine text not null default 'canvas',
  build_url text,
  avatar_adapter text not null default 'slop-character-v1',
  reward_rules jsonb not null default '{}',
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table game_sessions (
  id uuid primary key default gen_random_uuid(),
  game_slug text not null references games(slug),
  user_id uuid not null references users(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  score integer not null default 0,
  reward_granted boolean not null default false,
  metadata jsonb not null default '{}'
);

create table game_scores (
  id uuid primary key default gen_random_uuid(),
  game_slug text not null references games(slug),
  user_id uuid not null references users(id) on delete cascade,
  score integer not null check (score >= 0),
  character_snapshot jsonb not null,
  created_at timestamptz not null default now()
);

create table moderation_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references users(id) on delete set null,
  reported_user_id uuid references users(id) on delete set null,
  post_id uuid references posts(id) on delete cascade,
  comment_id uuid references comments(id) on delete cascade,
  reason text not null,
  status moderation_status not null default 'OPEN',
  moderator_notes text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index posts_public_feed_idx on posts (created_at desc) where visibility = 'PUBLIC';
create index comments_post_idx on comments (post_id, created_at asc);
create index game_scores_leaderboard_idx on game_scores (game_slug, score desc, created_at asc);
create index slop_entries_score_idx on slop_contest_entries (contest_id, score desc);
