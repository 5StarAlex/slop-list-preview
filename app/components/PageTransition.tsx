"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { aboutNavItem, siteNavItems } from "../lib/siteData";

type TransitionStage = "idle" | "exiting" | "entering";
type TransitionDirection = "left" | "right" | "none";

const routeOrder = [...siteNavItems, aboutNavItem].map((item) => item.href);

function getRouteIndex(pathname: string) {
  return routeOrder.indexOf(pathname);
}

function getDirection(fromPath: string, toPath: string): TransitionDirection {
  const fromIndex = getRouteIndex(fromPath);
  const toIndex = getRouteIndex(toPath);

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return "none";
  }

  return toIndex > fromIndex ? "left" : "right";
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const [displayedPathname, setDisplayedPathname] = useState(pathname);
  const [transitionStage, setTransitionStage] = useState<TransitionStage>("idle");
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>("none");
  const pendingChildrenRef = useRef(children);
  const pendingPathnameRef = useRef(pathname);

  useEffect(() => {
    pendingChildrenRef.current = children;
    pendingPathnameRef.current = pathname;

    if (pathname === displayedPathname) {
      return;
    }

    const nextDirection = getDirection(displayedPathname, pathname);
    const exitTimer = window.setTimeout(() => {
      setTransitionDirection(nextDirection);
      setTransitionStage("exiting");
    }, 0);

    const swapTimer = window.setTimeout(() => {
      setDisplayedChildren(pendingChildrenRef.current);
      setDisplayedPathname(pendingPathnameRef.current);
      setTransitionStage("entering");
    }, 170);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(swapTimer);
    };
  }, [children, displayedPathname, pathname]);

  useEffect(() => {
    if (transitionStage !== "entering") {
      return;
    }

    const settleTimer = window.setTimeout(() => {
      setTransitionStage("idle");
    }, 280);

    return () => window.clearTimeout(settleTimer);
  }, [transitionStage]);

  return (
    <div className={`page-transition-shell is-${transitionStage} is-${transitionDirection}`}>
      {displayedChildren}
    </div>
  );
}
