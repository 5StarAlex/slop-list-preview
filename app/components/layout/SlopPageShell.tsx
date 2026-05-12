import { type ReactNode } from "react";
import SiteHeader from "../SiteHeader";

type SlopPageShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function SlopPageShell({
  children,
  className = "",
  contentClassName = "",
}: SlopPageShellProps) {
  return (
    <div className={`slop-site-shell ${className}`.trim()}>
      <div className="slop-site-bg" aria-hidden="true">
        <span className="slop-site-starfield" />
        <span className="slop-site-grid" />
        <span className="slop-site-sweep is-pink" />
        <span className="slop-site-sweep is-blue" />
        <span className="slop-site-confetti" />
        <span className="slop-site-orb is-left" />
        <span className="slop-site-orb is-right" />
        <span className="slop-site-shard is-one" />
        <span className="slop-site-shard is-two" />
      </div>
      <SiteHeader />
      <div className={`slop-site-content ${contentClassName}`.trim()}>{children}</div>
    </div>
  );
}
