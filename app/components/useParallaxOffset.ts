"use client";

import { useState } from "react";

export type ParallaxOffset = {
  x: number;
  y: number;
};

const neutralOffset: ParallaxOffset = { x: 0, y: 0 };

export function useParallaxOffset() {
  const [offset, setOffset] = useState<ParallaxOffset>(neutralOffset);

  const handleMouseMove = <T extends HTMLElement>(event: React.MouseEvent<T>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    setOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setOffset(neutralOffset);
  };

  return {
    offset,
    handleMouseMove,
    handleMouseLeave,
  };
}
