"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { aboutNavItem, siteNavItems } from "../lib/siteData";
import tabSkin from "../NewStyleIcons/Tabs.png";

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
            <Image src={tabSkin} alt="" className="pixel-tab-skin" aria-hidden="true" />
            <span className="pixel-tab-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="pixel-nav" aria-label="Main navigation">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} className={`pixel-tab${pathname === item.href ? " is-active" : ""}`}>
          <Image src={tabSkin} alt="" className="pixel-tab-skin" aria-hidden="true" />
          <span className="pixel-tab-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
