"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount } from "./AccountProvider";
import SpaceParallaxLayers from "./SpaceParallaxLayers";
import { useParallaxOffset } from "./useParallaxOffset";

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

type AttackPixel = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
};

type GamePhase = "idle" | "intro" | "countdown" | "playing" | "gameover";
type SlimeFlight = {
  startY: number;
  endY: number;
  duration: number;
};

const PARTICLE_SPEED = 18;
const MIN_SPEED = 1;
const MAX_SPEED = 100;
const PLAYER_SIZE = 8;
const ABILITY_CHARGE_SECONDS = 15;
const COIN_AWARD_SECONDS = 5;
const ATTACK_PIXEL_COUNT = 24;
const ATTACK_SPEED = 150;
const ATTACK_LIFE_SECONDS = 0.4;

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

function formatElapsedTime(seconds: number) {
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function buildSlimeFlight(height: number): SlimeFlight {
  const safeHeight = Math.max(height, 72);
  const startY = Math.random() * Math.max(12, safeHeight * 0.4);
  const endY = safeHeight * 0.56 + Math.random() * Math.max(14, safeHeight * 0.32);

  return {
    startY,
    endY,
    duration: 4.8 + Math.random() * 2.1,
  };
}

export default function SpaceGamePanel() {
  const { account, addCoins } = useAccount();
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [driftPixels, setDriftPixels] = useState<DriftPixel[]>([]);
  const [attackPixels, setAttackPixels] = useState<AttackPixel[]>([]);
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [overlayText, setOverlayText] = useState<string | null>(null);
  const [overlayKey, setOverlayKey] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerFlash, setTimerFlash] = useState(false);
  const [abilityReady, setAbilityReady] = useState(false);
  const [slimeFlight, setSlimeFlight] = useState<SlimeFlight>({
    startY: 18,
    endY: 64,
    duration: 5.6,
  });

  const nextId = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastFrameTime = useRef<number | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const phaseRef = useRef<GamePhase>("idle");
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const driftPixelsRef = useRef<DriftPixel[]>([]);
  const attackPixelsRef = useRef<AttackPixel[]>([]);
  const abilityReadyRef = useRef(false);
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const coinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abilityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameStartRef = useRef<number | null>(null);
  const lastCoinAwardRef = useRef<number | null>(null);
  const addCoinsRef = useRef(addCoins);
  const { offset, handleMouseMove, handleMouseLeave } = useParallaxOffset();

  useEffect(() => {
    addCoinsRef.current = addCoins;
  }, [addCoins]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    driftPixelsRef.current = driftPixels;
  }, [driftPixels]);

  useEffect(() => {
    attackPixelsRef.current = attackPixels;
  }, [attackPixels]);

  useEffect(() => {
    abilityReadyRef.current = abilityReady;
  }, [abilityReady]);

  useEffect(() => {
    const updateFlight = () => {
      const height = marqueeRef.current?.getBoundingClientRect().height ?? 108;
      setSlimeFlight(buildSlimeFlight(height));
    };

    updateFlight();
    window.addEventListener("resize", updateFlight);
    return () => window.removeEventListener("resize", updateFlight);
  }, []);

  const clearGameTimeouts = () => {
    for (const timeout of timeoutsRef.current) {
      window.clearTimeout(timeout);
    }

    timeoutsRef.current = [];

    if (coinIntervalRef.current) {
      window.clearInterval(coinIntervalRef.current);
      coinIntervalRef.current = null;
    }

    if (abilityTimeoutRef.current) {
      window.clearTimeout(abilityTimeoutRef.current);
      abilityTimeoutRef.current = null;
    }
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
    const now = performance.now();
    gameStartRef.current = now;
    lastCoinAwardRef.current = now;
    setAbilityReady(false);
  };

  const gameStart = () => {
    clearGameTimeouts();
    setElapsedSeconds(0);
    setTimerFlash(false);
    setAbilityReady(false);
    setAttackPixels([]);
    gameStartRef.current = null;
    lastCoinAwardRef.current = null;
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

      const nextPixel = {
        id: nextId.current++,
        x: bounds.width + pixelSize,
        y: topPadding + Math.random() * (maxY - topPadding),
        size: pixelSize,
      };

      driftPixelsRef.current = [...driftPixelsRef.current, nextPixel];
      setDriftPixels(driftPixelsRef.current);
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

      const nextAttacks = frozen
        ? attackPixelsRef.current
        : attackPixelsRef.current
            .map((pixel) => ({
              ...pixel,
              x: pixel.x + pixel.vx * deltaSeconds,
              y: pixel.y + pixel.vy * deltaSeconds,
              life: pixel.life - deltaSeconds,
            }))
            .filter((pixel) => pixel.life > 0);

      let nextPixels = frozen
        ? driftPixelsRef.current
        : driftPixelsRef.current
            .map((pixel) => ({
              ...pixel,
              x: pixel.x - pixelsPerSecond * deltaSeconds,
            }))
            .filter((pixel) => pixel.x + pixel.size > -12);

      if (nextAttacks.length > 0) {
        nextPixels = nextPixels.filter((pixel) => {
          return !nextAttacks.some((attack) => {
            const pixelCenterX = pixel.x + pixel.size / 2;
            const pixelCenterY = pixel.y + pixel.size / 2;
            const attackCenterX = attack.x + attack.size / 2;
            const attackCenterY = attack.y + attack.size / 2;
            const dx = pixelCenterX - attackCenterX;
            const dy = pixelCenterY - attackCenterY;
            return Math.sqrt(dx * dx + dy * dy) <= attack.size + pixel.size;
          });
        });
      }

      if (phaseRef.current === "playing") {
        if (cursorRef.current) {
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
          }
        }

        if (gameStartRef.current != null) {
          setElapsedSeconds((time - gameStartRef.current) / 1000);
        }
      }

      attackPixelsRef.current = nextAttacks;
      driftPixelsRef.current = nextPixels;
      setAttackPixels(nextAttacks);
      setDriftPixels(nextPixels);
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

  useEffect(() => {
    if (phase !== "playing") {
      if (coinIntervalRef.current) {
        window.clearInterval(coinIntervalRef.current);
        coinIntervalRef.current = null;
      }

      if (abilityTimeoutRef.current) {
        window.clearTimeout(abilityTimeoutRef.current);
        abilityTimeoutRef.current = null;
      }

      return;
    }

    coinIntervalRef.current = window.setInterval(() => {
      addCoinsRef.current(5);
      flashTimer();
      lastCoinAwardRef.current = performance.now();
    }, COIN_AWARD_SECONDS * 1000);

    const armAbility = () => {
      if (abilityTimeoutRef.current) {
        window.clearTimeout(abilityTimeoutRef.current);
      }

      abilityTimeoutRef.current = window.setTimeout(() => {
        setAbilityReady(true);
        abilityTimeoutRef.current = null;
      }, ABILITY_CHARGE_SECONDS * 1000);
    };

    if (!abilityReadyRef.current) {
      armAbility();
    }

    return () => {
      if (coinIntervalRef.current) {
        window.clearInterval(coinIntervalRef.current);
        coinIntervalRef.current = null;
      }

      if (abilityTimeoutRef.current) {
        window.clearTimeout(abilityTimeoutRef.current);
        abilityTimeoutRef.current = null;
      }
    };
  }, [phase]);

  return (
    <section className="space-game-card">
      <div
        ref={marqueeRef}
        className="status-marquee sidebar-game-marquee"
        aria-label="Animated slime banner"
        onMouseEnter={() => {
          if (phaseRef.current === "idle") {
            gameStart();
          }
        }}
        onMouseMove={(event) => {
          handleMouseMove(event);
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
          handleMouseLeave();
          clearGameTimeouts();
          setTrail([]);
          setAttackPixels([]);
          cursorRef.current = null;
          setPhase("idle");
          setOverlayText(null);
          setElapsedSeconds(0);
          setTimerFlash(false);
          setAbilityReady(false);
          gameStartRef.current = null;
          lastCoinAwardRef.current = null;
        }}
        onClick={() => {
          if (phaseRef.current !== "playing" || !abilityReadyRef.current || !cursorRef.current) {
            return;
          }

          const originX = cursorRef.current.x;
          const originY = cursorRef.current.y;
          const newAttackPixels: AttackPixel[] = Array.from(
            { length: ATTACK_PIXEL_COUNT },
            (_, index) => {
              const angle = (Math.PI * 2 * index) / ATTACK_PIXEL_COUNT;
              return {
                id: nextId.current++,
                x: originX,
                y: originY,
                vx: Math.cos(angle) * ATTACK_SPEED,
                vy: Math.sin(angle) * ATTACK_SPEED,
                size: 8,
                life: ATTACK_LIFE_SECONDS,
              };
            },
          );

          attackPixelsRef.current = newAttackPixels;
          setAttackPixels(newAttackPixels);
          setAbilityReady(false);

          if (abilityTimeoutRef.current) {
            window.clearTimeout(abilityTimeoutRef.current);
          }

          abilityTimeoutRef.current = window.setTimeout(() => {
            setAbilityReady(true);
            abilityTimeoutRef.current = null;
          }, ABILITY_CHARGE_SECONDS * 1000);
        }}
      >
        <div className="slime-track">
          <SpaceParallaxLayers
            offset={offset}
            className="space-game-layers"
            includeNebula={false}
            includeScanlines
            intensity="high"
          />

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

          <div
            className="pixel-slime"
            aria-hidden="true"
            onAnimationIteration={() => {
              const height = marqueeRef.current?.getBoundingClientRect().height ?? 108;
              setSlimeFlight(buildSlimeFlight(height));
            }}
            style={{
              ["--slime-start-y" as string]: `${slimeFlight.startY}px`,
              ["--slime-end-y" as string]: `${slimeFlight.endY}px`,
              ["--slime-duration" as string]: `${slimeFlight.duration}s`,
            }}
          >
            <span className="slime-eye left" />
            <span className="slime-eye right" />
          </div>

          {trail.map((point, index) => (
            <span
              key={point.id}
              className={`cursor-pixel${index === trail.length - 1 && abilityReady ? " cursor-pixel-ability" : ""}`}
              style={{
                left: point.x,
                top: point.y,
                opacity: (index + 1) / trail.length,
              }}
              aria-hidden="true"
            />
          ))}

          {attackPixels.map((pixel) => (
            <span
              key={pixel.id}
              className="attack-pixel"
              style={{
                left: pixel.x,
                top: pixel.y,
                width: pixel.size,
                height: pixel.size,
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

          <div className="game-coins">Coins: {account.economy.coins}</div>
        </div>
      </div>
    </section>
  );
}
