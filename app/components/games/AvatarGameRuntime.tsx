"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount } from "../AccountProvider";
import { type CharacterConfig } from "../slopOptions";
import { validateGameScore } from "../../lib/platformValidation";

type AvatarGameRuntimeProps = {
  title: string;
  rewardRule: string;
};

function colorForConfig(config: CharacterConfig) {
  const palette = ["#f6b47d", "#f06f9a", "#72d2ff", "#c7ff4f", "#8f75ff", "#ffb93d"];
  return palette[config.color % palette.length] ?? palette[0];
}

export default function AvatarGameRuntime({ title, rewardRule }: AvatarGameRuntimeProps) {
  const { account, addCoins } = useAccount();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [status, setStatus] = useState("Ready");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const canvasEl = canvas;
    let playerY = 0;
    let velocity = 0;
    let obstacleX = canvas.width + 80;
    let localScore = 0;
    let running = true;
    const keys = new Set<string>();
    const avatarColor = colorForConfig(account.characterConfig);

    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowUp", " ", "w", "W"].includes(event.key)) {
        keys.add("jump");
      }
    };

    const onPointerDown = () => keys.add("jump");

    window.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("pointerdown", onPointerDown);

    function drawAvatar(x: number, y: number) {
      if (!context) {
        return;
      }

      context.fillStyle = avatarColor;
      context.strokeStyle = "#11131a";
      context.lineWidth = 4;
      context.beginPath();
      context.roundRect(x, y + 24, 42, 46, 10);
      context.fill();
      context.stroke();
      context.fillStyle = "#fff2ce";
      context.beginPath();
      context.arc(x + 22, y + 16, 19, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.fillStyle = "#11131a";
      context.fillRect(x + 13, y + 12, 5, 5);
      context.fillRect(x + 27, y + 12, 5, 5);
      context.fillRect(x + 16, y + 24, 13, 4);
      context.fillStyle = account.equippedShopItemIds.includes("white-mouse-trail") ? "#ffffff" : "#dfff36";
      context.fillRect(x - 8, y + 32, 10, 8);
    }

    function draw() {
      if (!context || !running) {
        return;
      }

      context.clearRect(0, 0, canvasEl.width, canvasEl.height);

      const groundY = canvasEl.height - 74;
      if (keys.has("jump") && playerY === 0) {
        velocity = -17;
        keys.delete("jump");
        setStatus("Jump");
      }

      velocity += 0.9;
      playerY = Math.min(0, playerY + velocity);
      if (playerY === 0 && velocity > 0) {
        velocity = 0;
      }

      obstacleX -= 7.5;
      if (obstacleX < -40) {
        obstacleX = canvasEl.width + 70 + Math.random() * 130;
        localScore += 250;
        setScore(localScore);
        setStatus("Clean dodge");
      }

      context.fillStyle = "#11131a";
      context.fillRect(0, groundY + 68, canvasEl.width, 8);
      context.fillStyle = "#83eaff";
      context.fillRect(0, groundY + 76, canvasEl.width, 8);

      context.fillStyle = "#ff4f99";
      context.strokeStyle = "#11131a";
      context.lineWidth = 4;
      context.beginPath();
      context.roundRect(obstacleX, groundY + 18, 34, 50, 8);
      context.fill();
      context.stroke();

      const playerX = 92;
      const playerTop = groundY + playerY;
      drawAvatar(playerX, playerTop);

      context.fillStyle = "rgba(255, 255, 255, 0.72)";
      context.font = "900 18px Verdana";
      context.fillText(`${title} / ${localScore}`, 18, 30);

      const hit =
        obstacleX < playerX + 42 &&
        obstacleX + 34 > playerX &&
        groundY + 18 < playerTop + 70 &&
        groundY + 68 > playerTop + 24;

      if (hit) {
        running = false;
        const error = validateGameScore(localScore);
        const reward = error ? 0 : Math.min(75, Math.floor(localScore / 150));
        if (reward > 0) {
          addCoins(reward);
        }
        setBestScore((current) => Math.max(current, localScore));
        setStatus(reward > 0 ? `Run saved: +${reward} stars` : "Run saved");
        return;
      }

      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      running = false;
      window.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("pointerdown", onPointerDown);
    };
  }, [account.characterConfig, account.equippedShopItemIds, addCoins, title]);

  return (
    <section className="avatar-game-runtime">
      <div className="avatar-game-screen">
        <canvas ref={canvasRef} width={900} height={420} aria-label={`${title} canvas game`} />
      </div>
      <aside className="avatar-game-hud">
        <h2>{title}</h2>
        <p>{rewardRule}</p>
        <div>
          <span><strong>{score}</strong>Score</span>
          <span><strong>{bestScore}</strong>Best</span>
          <span><strong>{account.profile.displayName}</strong>Avatar</span>
        </div>
        <em>{status}</em>
      </aside>
    </section>
  );
}
