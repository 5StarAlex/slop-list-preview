"use client";

import { useEffect, useRef, useState } from "react";

type TrailPoint = {
  id: number;
  x: number;
  y: number;
};

type DriftPixel = {
  id: number;
  x: number;
  y: number;
  size: number;
};

type GamePhase = "idle" | "intro" | "countdown" | "playing" | "gameover";

const PARTICLE_SPEED = 18;
const MIN_SPEED = 1;
const MAX_SPEED = 100;
const PLAYER_SIZE = 8;

function speedToPixelsPerSecond(speed: number) {
  const clamped = Math.min(Math.max(speed, MIN_SPEED), MAX_SPEED);
  return 6 + clamped * 3;
}

function randomSpawnDelay() {
  return 120 + Math.random() * 280;
}

function isFrozen(phase: GamePhase) {
  return phase === "intro" || phase === "countdown";
}

export default function SiteHeader() {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [driftPixels, setDriftPixels] = useState<DriftPixel[]>([]);
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [overlayText, setOverlayText] = useState<string | null>(null);
  const [overlayKey, setOverlayKey] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [timerFlash, setTimerFlash] = useState(false);

  const nextId = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastFrameTime = useRef<number | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const phaseRef = useRef<GamePhase>("idle");
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const gameStartRef = useRef<number | null>(null);
  const awardedMilestonesRef = useRef(0);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const clearGameTimeouts = () => {
    for (const timeout of timeoutsRef.current) {
      window.clearTimeout(timeout);
    }
    timeoutsRef.current = [];
  };

  const flashTimer = () => {
    setTimerFlash(true);
    const timeout = window.setTimeout(() => setTimerFlash(false), 500);
    timeoutsRef.current.push(timeout);
  };

  const triggerOverlay = (text: string | null) => {
    setOverlayText(text);
    setOverlayKey((current) => current + 1);
  };

  const pause = () => {
    setPhase("intro");
  };

  const continueGame = () => {
    setOverlayText(null);
    setPhase("playing");
    setTimerKey((current) => current + 1);
    gameStartRef.current = performance.now();
    awardedMilestonesRef.current = 0;
  };

  const gameStart = () => {
    clearGameTimeouts();
    setElapsedSeconds(0);
    setTimerFlash(false);
    awardedMilestonesRef.current = 0;
    gameStartRef.current = null;
    pause();
    triggerOverlay("GAME START");

    const schedule = (delay: number, callback: () => void) => {
      const timeout = window.setTimeout(callback, delay);
      timeoutsRef.current.push(timeout);
    };

    schedule(1000, () => {
      setPhase("countdown");
      triggerOverlay("3");
    });

    schedule(1800, () => triggerOverlay("2"));
    schedule(2600, () => triggerOverlay("1"));

    schedule(3400, continueGame);
  };

  useEffect(() => {
    let cancelled = false;

    const spawnPixel = () => {
      if (cancelled) {
        return;
      }

      if (!marqueeRef.current || isFrozen(phaseRef.current)) {
        timeoutRef.current = window.setTimeout(spawnPixel, randomSpawnDelay());
        return;
      }

      const bounds = marqueeRef.current.getBoundingClientRect();
      const pixelSize = 5 + Math.floor(Math.random() * 4);
      const topPadding = 4;
      const maxY = Math.max(topPadding, bounds.height - pixelSize - topPadding);

      setDriftPixels((current) => [
        ...current,
        {
          id: nextId.current++,
          x: bounds.width + pixelSize,
          y: topPadding + Math.random() * (maxY - topPadding),
          size: pixelSize,
        },
      ]);

      timeoutRef.current = window.setTimeout(spawnPixel, randomSpawnDelay());
    };

    const step = (time: number) => {
      if (cancelled) {
        return;
      }

      if (lastFrameTime.current == null) {
        lastFrameTime.current = time;
      }

      const deltaSeconds = (time - lastFrameTime.current) / 1000;
      lastFrameTime.current = time;
      const pixelsPerSecond = speedToPixelsPerSecond(PARTICLE_SPEED);
      const frozen = isFrozen(phaseRef.current);

      setDriftPixels((current) => {
        const nextPixels = frozen
          ? current
          : current
              .map((pixel) => ({
                ...pixel,
                x: pixel.x - pixelsPerSecond * deltaSeconds,
              }))
              .filter((pixel) => pixel.x + pixel.size > -12);

        if (phaseRef.current === "playing" && cursorRef.current) {
          const hit = nextPixels.some((pixel) => {
            const pixelRight = pixel.x + pixel.size;
            const pixelBottom = pixel.y + pixel.size;
            const playerLeft = cursorRef.current.x - PLAYER_SIZE / 2;
            const playerTop = cursorRef.current.y - PLAYER_SIZE / 2;
            const playerRight = playerLeft + PLAYER_SIZE;
            const playerBottom = playerTop + PLAYER_SIZE;

            return !(
              playerRight < pixel.x ||
              playerLeft > pixelRight ||
              playerBottom < pixel.y ||
              playerTop > pixelBottom
            );
          });

          if (hit) {
            setPhase("gameover");
            triggerOverlay("GAME OVER");
            gameStartRef.current = null;
          } else if (gameStartRef.current != null) {
            const survivedSeconds = (time - gameStartRef.current) / 1000;
            setElapsedSeconds(survivedSeconds);
            const milestones = Math.floor(survivedSeconds / 5);

            if (milestones > awardedMilestonesRef.current) {
              const earnedNow = milestones - awardedMilestonesRef.current;
              awardedMilestonesRef.current = milestones;
              setEarnedCoins((currentCoins) => currentCoins + earnedNow);
              flashTimer();
            }
          }
        }

        return nextPixels;
      });

      frameRef.current = window.requestAnimationFrame(step);
    };

    timeoutRef.current = window.setTimeout(spawnPixel, randomSpawnDelay());
    frameRef.current = window.requestAnimationFrame(step);

    return () => {
      cancelled = true;
      clearGameTimeouts();
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <header className="masthead">
      <div className="logo-stack">
        <h1 className="logo-title">The Slop List</h1>
        <p className="logo-subtitle">jittyboyz.inc</p>
      </div>

      <div
        ref={marqueeRef}
        className="status-marquee"
        aria-label="Animated slime banner"
        onMouseEnter={() => {
          if (phaseRef.current === "idle") {
            gameStart();
          }
        }}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const point = {
            id: nextId.current++,
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          };

          cursorRef.current = { x: point.x, y: point.y };
          setTrail((current) => [...current.slice(-8), point]);
        }}
        onMouseLeave={() => {
          clearGameTimeouts();
          setTrail([]);
          cursorRef.current = null;
          setPhase("idle");
          setOverlayText(null);
          setElapsedSeconds(0);
          setTimerFlash(false);
          gameStartRef.current = null;
        }}
      >
        <div className="slime-track">
          {driftPixels.map((pixel) => (
            <span
              key={pixel.id}
              className="drift-pixel"
              style={{
                left: pixel.x,
                top: pixel.y,
                width: pixel.size,
                height: pixel.size,
              }}
              aria-hidden="true"
            />
          ))}

          <div className="pixel-slime" aria-hidden="true">
            <span className="slime-eye left" />
            <span className="slime-eye right" />
          </div>

          {trail.map((point, index) => (
            <span
              key={point.id}
              className="cursor-pixel"
              style={{
                left: point.x,
                top: point.y,
                opacity: (index + 1) / trail.length,
              }}
              aria-hidden="true"
            />
          ))}

          {overlayText ? (
            <div key={overlayKey} className="game-overlay">
              <span className="game-overlay-text">{overlayText}</span>
            </div>
          ) : null}

          {phase !== "idle" ? (
            <div className="game-hud">
              <div
                key={timerKey}
                className={`game-timer game-timer-visible${timerFlash ? " game-timer-flash" : ""}`}
              >
                Time: {formatElapsedTime(phase === "playing" ? elapsedSeconds : 0)}
              </div>
            </div>
          ) : null}

          <div className="game-coins">Slop Coins Won: {earnedCoins}</div>
        </div>
      </div>
    </header>
  );
}

function formatElapsedTime(seconds: number) {
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
