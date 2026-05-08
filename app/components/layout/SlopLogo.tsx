"use client";

import Image from "next/image";
import Link from "next/link";
import slopListLogo from "../../NewStyleIcons/SlopListLogo.png";

export default function SlopLogo() {
  return (
    <Link href="/" className="slop-logo" aria-label="Go to home page">
      <Image src={slopListLogo} alt="Slop List" className="slop-logo-image" priority />
      <span className="slop-logo-glow" aria-hidden="true" />
    </Link>
  );
}
