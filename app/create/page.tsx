import ComicShell from "../components/ComicShell";

const feed = [
  {
    name: "WeebKing",
    tag: "Anime",
    time: "2h ago",
    title: "Frieren is peak fantasy \u2728",
    copy: "The animation, the story, the vibes... everything is just 10/10. Himmel still best boy.",
    stats: ["342", "27", "12"],
    art: "is-frieren",
  },
  {
    name: "SlopQueen",
    tag: "Meme",
    time: "5h ago",
    title: "When the episode ends on a cliffhanger \ud83d\ude2d",
    copy: "",
    stats: ["512", "38", "21"],
    art: "is-meme",
  },
  {
    name: "ZenitsuSimpp",
    tag: "Discussion",
    time: "1d ago",
    title: "Who had the best glow up?",
    copy: "Mine has to be Asta. Dude went from nothing to one of the strongest.",
    stats: ["276", "64", "9"],
    art: "is-glow",
  },
] as const;

export default function CreatePage() {
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

          <form className="comic-post-box">
            <h2><span aria-hidden="true">{"\u270f"}</span> WHAT DO YOU WANT TO POST?</h2>
            <div className="comic-post-tabs" role="tablist" aria-label="Post type">
              <button type="button" className="is-active"><span aria-hidden="true">{"\ud83d\udcac"}</span> Post</button>
              <button type="button"><span aria-hidden="true">{"\ud83d\ude42"}</span> Meme</button>
              <button type="button"><span aria-hidden="true">{"\ud83d\udc65"}</span> Discussion</button>
            </div>
            <label>
              <span>Add a title (optional)</span>
              <input placeholder="Enter a catchy title..." maxLength={100} />
              <em>0/100</em>
            </label>
            <label>
              <span>What&apos;s on your mind?</span>
              <textarea placeholder="Write your post here..." maxLength={2000} />
              <em>0/2000</em>
            </label>
            <div className="comic-post-tools">
              <button type="button">{"\ud83d\uddbc"} Add Image</button>
              <button type="button">GIF Add GIF</button>
              <button type="button">{"\ud83d\udcca"} Add Poll</button>
              <button type="button">{"!"} Add Spoiler</button>
            </div>
            <div className="comic-post-actions">
              <button type="reset">Cancel</button>
              <button type="submit" className="is-submit">{"\u27a4"} Post Slop</button>
            </div>
          </form>
        </section>

        <section className="comic-feed-panel">
          <div className="comic-feed-window-bar">
            <h2><span aria-hidden="true">{"\ud83d\udc65"}</span> COMMUNITY FEED</h2>
            <div className="comic-window-controls">
              <span>{"\u2b50"} 20</span>
              <button type="button">{"\u2212"}</button>
              <button type="button">{"\u26f6"}</button>
              <button type="button">{"\u00d7"}</button>
            </div>
          </div>

          <div className="comic-feed-list">
            {feed.map((post, index) => (
              <article key={post.name} className="comic-feed-card">
                <div className={`comic-feed-avatar is-${index + 1}`} />
                <div className="comic-feed-copy">
                  <p><strong>{post.name}</strong> <span>{"\u2714"}</span> <em>{post.time}</em></p>
                  <mark>{post.tag}</mark>
                  <h3>{post.title}</h3>
                  {post.copy ? <p>{post.copy}</p> : null}
                  <div className="comic-feed-stats">
                    <span>{"\ud83d\udc97"} {post.stats[0]}</span>
                    <span>{"\ud83d\udcac"} {post.stats[1]}</span>
                    <span>{"\u21aa"} {post.stats[2]}</span>
                    <span>{"\u25af"}</span>
                  </div>
                </div>
                <div className={`comic-feed-art ${post.art}`} />
                <button type="button" className="comic-feed-menu" aria-label="Open post menu">{"\u22ef"}</button>
              </article>
            ))}
          </div>

          <button type="button" className="comic-load-more">Load More <span aria-hidden="true">{"\u2304"}</span></button>
        </section>
      </main>
    </ComicShell>
  );
}
