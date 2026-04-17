"use client";

import { useEffect, useState } from "react";
import { useAccount } from "./AccountProvider";

type TrailPoint = {
  id: number;
  x: number;
  y: number;
};

export default function GlobalMouseTrail() {
  const { account } = useAccount();
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const enabled = account.unlocks.whiteTrailEnabled;

  useEffect(() => {
    if (!enabled) {
      setTrail([]);
      return;
    }

    let nextId = 0;

    const onMove = (event: MouseEvent) => {
      const point = {
        id: nextId++,
        x: event.clientX,
        y: event.clientY,
      };

      setTrail((current) => [...current.slice(-10), point]);
    };

    const clearTrail = () => {
      setTrail([]);
    };

    const root = document.documentElement;

    window.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", clearTrail);
    window.addEventListener("blur", clearTrail);

    return () => {
      window.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", clearTrail);
      window.removeEventListener("blur", clearTrail);
    };
  }, [enabled]);

  if (!enabled || trail.length === 0) {
    return null;
  }

  return (
    <div className="site-trail-overlay" aria-hidden="true">
      {trail.map((point, index) => (
        <span
          key={point.id}
          className="site-cursor-pixel"
          style={{
            left: point.x,
            top: point.y,
            opacity: (index + 1) / trail.length,
          }}
        />
      ))}
    </div>
  );
}
