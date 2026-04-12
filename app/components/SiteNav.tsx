"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { aboutNavItem, siteNavItems } from "../lib/siteData";

type SiteNavProps = {
  variant?: "default" | "profile";
};

export default function SiteNav({ variant = "default" }: SiteNavProps) {
  const pathname = usePathname();
  const navItems = [...siteNavItems, aboutNavItem];

  if (variant === "profile") {
    return (
      <nav className="pixel-nav profile-nav-row" aria-label="Profile navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`pixel-tab profile-home-button${pathname === item.href ? " is-active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="pixel-nav" aria-label="Main navigation">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} className={`pixel-tab${pathname === item.href ? " is-active" : ""}`}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
