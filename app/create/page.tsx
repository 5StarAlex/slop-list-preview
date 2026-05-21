"use client";

import Image from "next/image";
import { type ChangeEventHandler, type FormEvent, useMemo, useState } from "react";
import ComicShell from "../components/ComicShell";
import { useAccount } from "../components/AccountProvider";

const postTypes = [
  {
    key: "post",
    label: "Post",
    icon: "\ud83d\udcac",
    heading: "WHAT DO YOU WANT TO POST?",
    titlePlaceholder: "Enter a catchy title...",
    bodyLabel: "What's on your mind?",
    bodyPlaceholder: "Write your post here...",
    submitLabel: "Post Slop",
  },
  {
    key: "meme",
    label: "Meme",
    icon: "\ud83d\ude42",
    heading: "DROP A MEME",
    titlePlaceholder: "Name this beautiful disaster...",
    bodyLabel: "Add meme context",
    bodyPlaceholder: "Set up the joke, tag the moment, or leave it mysterious...",
    submitLabel: "Post Meme",
  },
  {
    key: "discussion",
    label: "Discussion",
    icon: "\ud83d\udc65",
    heading: "START A DISCUSSION",
    titlePlaceholder: "Ask the community something spicy...",
    bodyLabel: "What should everyone weigh in on?",
    bodyPlaceholder: "Write the prompt, theory, hot take, or question here...",
    submitLabel: "Start Discussion",
  },
] as const;

type PostTypeKey = (typeof postTypes)[number]["key"];

type Post = {
  id: number;
  type: string;
  author: string;
  title: string;
  body: string;
  spoiler: boolean;
  gifUrl: string;
  imageDataUrl?: string;
  poll?: string[];
};

const starterFeed: Post[] = [
  {
    id: 1,
    type: "Anime",
    author: "WeebKing",
    title: "Frieren is peak fantasy",
    body: "The animation, the story, the vibes... everything is just 10/10. Himmel still best boy.",
    spoiler: false,
    gifUrl: "",
  },
  {
    id: 2,
    type: "Discussion",
    author: "ZenitsuSimpp",
    title: "Who had the best glow up?",
    body: "Mine has to be Asta. Dude went from nothing to one of the strongest.",
    spoiler: false,
    gifUrl: "",
    poll: ["Asta", "Tanjiro"],
  },
];

export default function CreatePage() {
  const { account } = useAccount();
  const [activePostType, setActivePostType] = useState<PostTypeKey>("post");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [gifUrl, setGifUrl] = useState("");
  const [pollA, setPollA] = useState("");
  const [pollB, setPollB] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string>();
  const [posts, setPosts] = useState<Post[]>(starterFeed);

  const activeType = postTypes.find((type) => type.key === activePostType) ?? postTypes[0];
  const canPost = useMemo(() => title.trim().length > 0 || body.trim().length > 0 || Boolean(imageDataUrl), [body, imageDataUrl, title]);

  const onImage: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const submitPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canPost) {
      return;
    }

    const poll = pollA.trim() && pollB.trim() ? [pollA.trim(), pollB.trim()] : undefined;
    setPosts((current) => [
      {
        id: Date.now(),
        type: activeType.label,
        author: account.profile.displayName,
        title: title.trim() || "Untitled Slop",
        body: body.trim(),
        spoiler,
        gifUrl: gifUrl.trim(),
        imageDataUrl,
        poll,
      },
      ...current,
    ]);
    setTitle("");
    setBody("");
    setSpoiler(false);
    setGifUrl("");
    setPollA("");
    setPollB("");
    setImageDataUrl(undefined);
    event.currentTarget.reset();
  };

  return (
    <ComicShell className="comic-entry-page">
      <main className="comic-entry-layout">
        <section className="comic-entry-compose">
          <div className="comic-entry-hero">
            <p>CREATE A SLOP</p>
            <h1>SHARE YOUR <span>SLOP</span></h1>
            <div />
            <p>Post about anime, share memes, or start a discussion with the community!</p>
          </div>

          <form className="comic-post-box" onSubmit={submitPost}>
            <h2><span aria-hidden="true">{"\u270f"}</span> {activeType.heading}</h2>
            <div className="comic-post-tabs" role="tablist" aria-label="Post type">
              {postTypes.map((type) => {
                const isActive = activePostType === type.key;

                return (
                  <button
                    key={type.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={isActive ? "is-active" : ""}
                    onClick={() => setActivePostType(type.key)}
                  >
                    <span aria-hidden="true">{type.icon}</span> {type.label}
                  </button>
                );
              })}
            </div>
            <label>
              <span>Add a title</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={activeType.titlePlaceholder} maxLength={100} />
              <em>{title.length}/100</em>
            </label>
            <label>
              <span>{activeType.bodyLabel}</span>
              <textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder={activeType.bodyPlaceholder} maxLength={2000} />
              <em>{body.length}/2000</em>
            </label>
            <div className="comic-post-tools">
              <label className="comic-post-tool-field">
                <span>{"\ud83d\uddbc"} Add Image</span>
                <input type="file" accept="image/*" onChange={onImage} />
              </label>
              <label className="comic-post-tool-field">
                <span>GIF</span>
                <input value={gifUrl} onChange={(event) => setGifUrl(event.target.value)} placeholder="Paste GIF URL..." />
              </label>
              <label className="comic-post-tool-field">
                <span>Poll A</span>
                <input value={pollA} onChange={(event) => setPollA(event.target.value)} placeholder="First option" />
              </label>
              <label className="comic-post-tool-field">
                <span>Poll B</span>
                <input value={pollB} onChange={(event) => setPollB(event.target.value)} placeholder="Second option" />
              </label>
              <button type="button" className={spoiler ? "is-active" : ""} onClick={() => setSpoiler((current) => !current)}>
                {spoiler ? "\u2713 Spoiler On" : "! Add Spoiler"}
              </button>
            </div>
            {imageDataUrl ? (
              <div className="comic-post-preview">
                <Image src={imageDataUrl} alt="Upload preview" width={220} height={140} unoptimized />
                <button type="button" onClick={() => setImageDataUrl(undefined)}>Remove</button>
              </div>
            ) : null}
            <div className="comic-post-actions">
              <button type="reset" onClick={() => {
                setTitle("");
                setBody("");
                setSpoiler(false);
                setGifUrl("");
                setPollA("");
                setPollB("");
                setImageDataUrl(undefined);
              }}>
                Cancel
              </button>
              <button type="submit" className="is-submit" disabled={!canPost}>{"\u27a4"} {activeType.submitLabel}</button>
            </div>
          </form>
        </section>

        <section className="comic-feed-panel">
          <div className="comic-feed-window-bar">
            <h2><span aria-hidden="true">{"\ud83d\udc65"}</span> COMMUNITY FEED</h2>
            <div className="comic-window-controls">
              <span>{"\u2b50"} {account.economy.coins}</span>
            </div>
          </div>

          <div className="comic-feed-list">
            {posts.map((post) => (
              <article key={post.id} className="comic-feed-card">
                <div className="comic-feed-avatar" />
                <div className="comic-feed-copy">
                  <p><strong>{post.author}</strong> <span>{"\u2714"}</span> <em>now</em></p>
                  <mark>{post.type}</mark>
                  {post.spoiler ? <mark className="is-spoiler">SPOILER</mark> : null}
                  <h3>{post.title}</h3>
                  {post.body ? <p>{post.body}</p> : null}
                  {post.gifUrl ? <p><a href={post.gifUrl} target="_blank" rel="noreferrer">GIF attachment</a></p> : null}
                  {post.poll ? <p className="comic-post-poll">{post.poll.join(" vs ")}</p> : null}
                  <div className="comic-feed-stats">
                    <span>{"\ud83d\udc97"} 0</span>
                    <span>{"\ud83d\udcac"} 0</span>
                    <span>{"\u21aa"} Share</span>
                  </div>
                </div>
                <div className="comic-feed-art is-upload">
                  {post.imageDataUrl ? <Image src={post.imageDataUrl} alt="" fill unoptimized /> : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </ComicShell>
  );
}
