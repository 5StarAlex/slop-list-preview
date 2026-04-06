"use client";

import { useEffect, useState } from "react";
import { SHOP_EVENT_NAME, WHITE_TRAIL_STORAGE_KEY } from "../lib/siteData";

type TrailPoint = {
  id: number;
  x: number;
  y: number;
};

function readTrailEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(WHITE_TRAIL_STORAGE_KEY) === "true";
}

export default function GlobalMouseTrail() {
  const [enabled, setEnabled] = useState(() => readTrailEnabled());
  const [trail, setTrail] = useState<TrailPoint[]>([]);

  useEffect(() => {
    const syncEnabled = () => setEnabled(readTrailEnabled());

    window.addEventListener("storage", syncEnabled);
    window.addEventListener(SHOP_EVENT_NAME, syncEnabled as EventListener);

    return () => {
      window.removeEventListener("storage", syncEnabled);
      window.removeEventListener(SHOP_EVENT_NAME, syncEnabled as EventListener);
    };
  }, []);

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
