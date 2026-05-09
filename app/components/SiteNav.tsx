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

  return (
    <nav className={`slop-site-nav${variant === "profile" ? " slop-site-nav--profile" : ""}`} aria-label="Main navigation">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`slop-site-nav__item slop-site-nav__item--${item.accent}${pathname === item.href ? " is-active" : ""}`}
        >
          <span className={`slop-site-nav__icon is-${item.icon}`} aria-hidden="true" />
          <span className="slop-site-nav__label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
