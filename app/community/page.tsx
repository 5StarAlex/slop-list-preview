"use client";

import Image from "next/image";
import { type CSSProperties, type ChangeEventHandler, type FormEvent, useMemo, useState } from "react";
import ComicShell from "../components/ComicShell";
import { useAccount } from "../components/AccountProvider";
import { getUserById, platformPosts, type CommunityPost, type PlatformPostType } from "../lib/platformData";
import { validatePostInput } from "../lib/platformValidation";

type FeedTab = "feed" | "following" | "mine" | "saved";

const feedTabs: Array<{ key: FeedTab; label: string; icon?: string }> = [
  { key: "feed", label: "Feed", icon: "♟" },
  { key: "following", label: "Following" },
  { key: "mine", label: "My Posts" },
  { key: "saved", label: "Saved" },
];

const topics = [
  ["KingOfSlop", "1.2k posts"],
  ["SlopDesign", "842 posts"],
  ["SlopMemes", "621 posts"],
  ["ArcadeRuns", "589 posts"],
  ["SlopBattle", "473 posts"],
] as const;

const categories = [
  ["General", "2.1k", "💎"],
  ["Showcase", "1.3k", "⚙"],
  ["Slop Design", "987", "🪄"],
  ["Gameplay", "756", "🧪"],
  ["Arcade", "643", "🏆"],
  ["Feedback", "512", "☑"],
  ["Memes", "421", "🎭"],
] as const;

function tagForType(type: PlatformPostType) {
  if (type === "meme") return "Memes";
  if (type === "discussion") return "General";
  if (type === "character-showcase") return "King of Slop";
  if (type === "game-score") return "Arcade";
  if (type === "show-review") return "Catalog";
  return "General";
}

function FeedArt({ post }: { post: CommunityPost }) {
  const imageSource = post.imageDataUrl || post.imageUrl;

  if (imageSource) {
    return (
      <div className="community-feed-art">
        <Image src={imageSource} alt="" fill unoptimized />
      </div>
    );
  }

  return (
    <div className={`community-feed-art is-${post.type}`} aria-hidden="true">
      <span />
    </div>
  );
}

export default function CommunityPage() {
  const { account } = useAccount();
  const [activeTab, setActiveTab] = useState<FeedTab>("feed");
  const [postType, setPostType] = useState<PlatformPostType>("post");
  const [body, setBody] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [pollA, setPollA] = useState("");
  const [pollB, setPollB] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string>();
  const [feed, setFeed] = useState<CommunityPost[]>(platformPosts);
  const [status, setStatus] = useState("");

  const poll = pollA.trim() && pollB.trim() ? [pollA.trim(), pollB.trim()] : undefined;
  const hasAttachment = Boolean(imageDataUrl || gifUrl.trim() || poll);
  const validation = useMemo(
    () => validatePostInput({ title: body.slice(0, 84), body, hasAttachment }),
    [body, hasAttachment],
  );
  const canPost = validation.ok;

  const visibleFeed = useMemo(() => {
    if (activeTab === "mine") {
      return feed.filter((post) => post.authorId === "user-aerial-ace");
    }

    if (activeTab === "following") {
      return feed.filter((post) => post.authorId !== "user-aerial-ace");
    }

    if (activeTab === "saved") {
      return feed.filter((post) => post.reactions >= 90);
    }

    return feed;
  }, [activeTab, feed]);

  const onImage: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.set("file", file);
    fetch("/api/community/uploads", { method: "POST", body: formData }).catch(() => undefined);

    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(String(reader.result));
      setStatus(`Ready: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const resetComposer = () => {
    setBody("");
    setGifUrl("");
    setPollA("");
    setPollB("");
    setSpoiler(false);
    setImageDataUrl(undefined);
    setStatus("");
  };

  const submitPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canPost) return;

    const nextPost: CommunityPost = {
      id: `local-${Date.now()}`,
      type: postType,
      authorId: "user-aerial-ace",
      title: body.split("\n")[0]?.slice(0, 82) || "New community post",
      body: body.trim(),
      createdAt: "now",
      reactions: 0,
      comments: 0,
      tag: tagForType(postType),
      imageDataUrl,
      gifUrl: gifUrl.trim(),
      poll,
      spoiler,
      score: postType === "game-score" ? account.economy.coins : undefined,
    };

    setFeed((current) => [nextPost, ...current]);
    setStatus("Posted to feed.");
    resetComposer();
    event.currentTarget.reset();

    await fetch("/api/community/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextPost),
    }).catch(() => undefined);
  };

  return (
    <ComicShell className="community-hub-page">
      <main className="community-hub">
        <header className="community-tab-bar" aria-label="Community sections">
          {feedTabs.map((tab) => (
            <button key={tab.key} type="button" className={activeTab === tab.key ? "is-active" : ""} onClick={() => setActiveTab(tab.key)}>
              {tab.icon ? <span aria-hidden="true">{tab.icon}</span> : null}
              {tab.label}
            </button>
          ))}
          <strong><span aria-hidden="true">★</span> {account.economy.coins}</strong>
        </header>

        <section className="community-hub-grid">
          <aside className="community-compose-rail">
            <section className="community-side-card is-compose">
              <h2>Create A Slop</h2>
              <span aria-hidden="true" />
              <p>Share your slop, start a discussion, or connect with the community!</p>
              <button type="button" onClick={() => document.getElementById("community-post-box")?.focus()}>
                <span aria-hidden="true">✎</span> Create Post
              </button>
            </section>

            <section className="community-tool-card">
              <button type="button" onClick={() => setPostType("discussion")}><span aria-hidden="true">▥</span> Add Poll <em>⌄</em></button>
              <p>Ask a question and let the community vote.</p>
            </section>
            <section className="community-tool-card">
              <button type="button" onClick={() => document.getElementById("community-media-input")?.click()}><span aria-hidden="true">▧</span> Add Media <em>⌄</em></button>
              <p>Add images, GIFs, or videos to your post.</p>
            </section>
            <section className="community-tool-card">
              <button type="button" onClick={() => setPostType("character-showcase")}><span aria-hidden="true">◇</span> Add Tags <em>⌄</em></button>
              <p>Add up to 5 tags to help others find your post.</p>
            </section>

            <form className="community-mini-composer" onSubmit={submitPost}>
              <label htmlFor="community-post-box"><span aria-hidden="true">✎</span> What&apos;s on your mind?</label>
              <textarea id="community-post-box" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write your post here..." maxLength={2000} />
              <em>{validation.errors.body ?? `${body.length}/2000`}</em>

              <div className="community-post-type-row" aria-label="Post type">
                {(["post", "meme", "discussion", "character-showcase", "game-score"] as PlatformPostType[]).map((type) => (
                  <button key={type} type="button" className={postType === type ? "is-active" : ""} onClick={() => setPostType(type)}>
                    {tagForType(type)}
                  </button>
                ))}
              </div>

              <input id="community-media-input" type="file" accept="image/*" onChange={onImage} />
              <input value={gifUrl} onChange={(event) => setGifUrl(event.target.value)} placeholder="Paste GIF URL..." />
              <div className="community-poll-row">
                <input value={pollA} onChange={(event) => setPollA(event.target.value)} placeholder="Poll A" />
                <input value={pollB} onChange={(event) => setPollB(event.target.value)} placeholder="Poll B" />
              </div>
              <button type="button" className={spoiler ? "is-active" : ""} onClick={() => setSpoiler((current) => !current)}>Spoiler</button>
              {status ? <p>{status}</p> : null}
              <button type="submit" disabled={!canPost}>Post To Feed</button>
              <small>By posting, you agree to our Community Guidelines.</small>
            </form>
          </aside>

          <section className="community-feed-column">
            <header className="community-feed-head">
              <h1><span aria-hidden="true">♟</span> Community Feed</h1>
              <select aria-label="Sort feed">
                <option>Latest</option>
                <option>Popular</option>
                <option>Most Discussed</option>
              </select>
            </header>

            <div className="community-feed-stack">
              {visibleFeed.map((post) => {
                const user = getUserById(post.authorId);

                return (
                  <article key={post.id} className="community-post-card">
                    <div className="community-post-main">
                      <header>
                        <span
                          className="community-post-avatar"
                          style={{ "--avatar-image": `url(${user.profileImage})` } as CSSProperties}
                          aria-hidden="true"
                        />
                        <div>
                          <strong>{user.displayName}</strong>
                          <span>{post.createdAt}</span>
                          <mark>{post.tag}</mark>
                        </div>
                      </header>
                      <h2>{post.title}</h2>
                      <p>{post.body}</p>
                      {post.poll ? <em>{post.poll.join(" vs ")}</em> : null}
                      {post.score ? <em>{post.score.toLocaleString()} score posted</em> : null}
                      {post.spoiler ? <em>Spoiler</em> : null}
                      <footer>
                        <span>♥ {post.reactions}</span>
                        <span>♡ {post.comments}</span>
                        <button type="button">Share</button>
                        <button type="button">Report</button>
                        <button type="button">Save</button>
                      </footer>
                    </div>
                    <FeedArt post={post} />
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="community-info-rail">
            <section className="community-side-card">
              <h2><span aria-hidden="true">●</span> Trending Topics</h2>
              {topics.map(([topic, count]) => (
                <a key={topic} href={`#${topic}`}><span>#</span><strong>{topic}</strong><em>{count}</em></a>
              ))}
              <button type="button">View All Trends</button>
            </section>

            <section className="community-side-card">
              <h2><span aria-hidden="true">▰</span> Categories</h2>
              {categories.map(([name, count, icon]) => (
                <a key={name} href={`#${name}`}><span>{icon}</span><strong>{name}</strong><em>{count}</em></a>
              ))}
              <button type="button">View All Categories</button>
            </section>

            <section className="community-side-card is-rules">
              <h2><span aria-hidden="true">⬟</span> Community Rules</h2>
              <p>Be kind. No hate. Keep it slop.</p>
              <button type="button">View Full Rules</button>
            </section>
          </aside>
        </section>
      </main>
    </ComicShell>
  );
}
