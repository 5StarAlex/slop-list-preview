import Image from "next/image";
import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import SlopOfTheWeek from "./components/SlopOfTheWeek";

const navItems = [
  { href: "/", label: "Home Page" },
  { href: "/catalog", label: "Catalog" },
  { href: "/create", label: "Create Slop" },
  { href: "/rules", label: "Slop Rules" },
  { href: "/profile", label: "Profile" },
];

const discussionPosts = [
  {
    title: "Akiba Maid War: So bad its peak?",
    image:
      "https://m.media-amazon.com/images/M/MV5BYzA5YmZlNzMtYjdlZC00ZDg0LTgyMjEtNTZhYTFmYzJkNTg1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    emojis: ["\u{1F525}", "\u{1FAE0}", "\u{1F440}"],
    comment:
      "They was ready to up blick over any minor inconvenience \u{1F602}",
  },
  {
    title: "My life as a vending machine or some **** idk",
    image:
      "https://m.media-amazon.com/images/M/MV5BZjQ2MGYyYzgtODlhZi00YjczLWJmZTEtYzIxYWM1NTQ4ZGFlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    emojis: ["\u{1F979}", "\u{1F4A5}", "\u{1F60D}"],
    comment:
      "but no 86 season \u{1F610}",
  },
];

function FloatingWord({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`floating-word ${className}`.trim()} aria-label={text}>
      {text.split("").map((letter, index) => (
        <span
          key={`${text}-${index}`}
          className={`floating-letter${letter === " " ? " is-space" : ""}`}
          style={{ animationDelay: `${index * 0.14}s` }}
          aria-hidden="true"
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </span>
  );
}

export default function Home() {
  return (
    <div className="habbo-page">
      <SiteHeader />

      <div className="retro-layout">
        <aside className="left-column">
          <section className="pixel-card">
            <h2>
              <FloatingWord text="Slop Coins" />
            </h2>
            <div className="count-chip">5820 {"\u{1FA99}"}</div>
            <p>Post, react, and keep the board alive to stack more coins.</p>
          </section>

          <section className="paper-panel">
            <h3>
              <FloatingWord text="Get Yo Slop Coins Up" className="mini-floating-word" />
            </h3>
            <p>
              Wanna be the king of slop? to stack them coins up get involved with
              discussion posts, rank shows, or engagement bait for all I care.
              Just don&apos;t be broke!
            </p>
          </section>

          <div className="pixel-card">
            <div className="ad-box">IAC</div>
          </div>

          <div className="pixel-card">
            <div className="mini-title-wrap">
              <FloatingWord text="Top Meme" className="mini-floating-word" />
            </div>
            <div className="meme-frame">
              <Image
                src="https://i.redd.it/nn689gw7430d1.jpeg"
                alt="Top Meme"
                width={640}
                height={640}
                className="meme-image"
                unoptimized
              />
            </div>
          </div>

          <div className="footer-links">
            <Link href="/rules">Terms &amp; Conditions</Link>
            <Link href="/profile">Privacy Policy</Link>
            <Link href="/catalog">JittyBoyz Labs</Link>
          </div>
        </aside>

        <section className="main-column">
          <div className="main-shell">
            <nav className="pixel-nav" aria-label="Main navigation">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="pixel-tab">
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="board-grid">
              <div id="slop-of-the-week">
                <SlopOfTheWeek />
              </div>

              <aside className="news-column">
                <section className="news-card">
                  <h3 className="board-title">
                    <FloatingWord text="Slop Board" className="glow-floating-word" />
                  </h3>

                  <div className="discussion-list">
                    {discussionPosts.map((post) => (
                      <article key={post.title} className="discussion-card">
                        <div className="discussion-image-frame">
                          <div className="emoji-float-row" aria-hidden="true">
                            {post.emojis.map((emoji, index) => (
                              <span
                                key={`${post.title}-${emoji}`}
                                className="emoji-float"
                                style={{ animationDelay: `${index * 0.28}s` }}
                              >
                                {emoji}
                              </span>
                            ))}
                          </div>
                          <Image
                            src={post.image}
                            alt={post.title}
                            width={1000}
                            height={1500}
                            className="discussion-image"
                            unoptimized
                          />
                        </div>

                        <div className="discussion-copy">
                          <strong>{post.title}</strong>
                          <p>{post.comment}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="nav-box">
                  <h3>Travel Pages</h3>
                  <p>The middle box handles all the page jumps, just like the reference.</p>
                  <div className="route-list">
                    <Link href="/catalog" className="route-button">
                      Go To Catalog
                    </Link>
                    <Link href="/create" className="route-button">
                      Open Create
                    </Link>
                    <Link href="/rules" className="route-button">
                      Read Rules
                    </Link>
                    <Link href="/profile" className="route-button">
                      View Profile
                    </Link>
                  </div>
                </section>

                <section className="mini-card">
                  <h3>Hotel Happenings</h3>
                  <p>
                    Slime is active in the top bar, stat chips bounce on hover, and
                    the board is starting to feel way more alive.
                  </p>
                </section>
              </aside>
            </div>
          </div>

          <p className="copyright">
            All rights including taste crimes, glowing pixels, and ranking drama are
            reserved by The Slop List.
          </p>
        </section>
      </div>
    </div>
  );
}
