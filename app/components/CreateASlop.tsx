"use client";

import Image from "next/image";
import { useState } from "react";
import arm1 from "../Character/arm1.svg";
import arm2 from "../Character/arm2.svg";
import body from "../Character/body.svg";
import eyesAngry from "../Character/eyes_angry.svg";
import eyesSad from "../Character/eyes_sad.svg";
import head from "../Character/head.svg";
import lashes from "../Character/lashes.svg";
import leg1 from "../Character/leg1.svg";
import leg2 from "../Character/leg2.svg";
import mouthAngry from "../Character/mouth_angry.svg";
import mouthSemiSad from "../Character/mouth_semi_sad.svg";
import mouthWhistle from "../Character/mouth_whistle.svg";

const creatorCategories = [
  { key: "eyes", label: "Eyes" },
  { key: "mouth", label: "Mouth" },
  { key: "shirt", label: "Shirt" },
  { key: "pants", label: "Pants" },
  { key: "accessories", label: "Accessories" },
  { key: "color", label: "Color" },
] as const;

const statRows = [
  { label: "Speed", values: [88, 74, 62, 68, 80, 56] },
  { label: "Dash", values: [42, 58, 84, 70, 64, 52] },
  { label: "Accent", values: [66, 78, 55, 90, 74, 95] },
  { label: "Skill", values: [52, 68, 72, 86, 79, 60] },
] as const;

function getCapsuleClass(distance: number) {
  if (distance === 0) {
    return "is-active";
  }

  if (distance === 1) {
    return "is-near";
  }

  if (distance === 2) {
    return "is-mid";
  }

  return "is-far";
}

export default function CreateASlop() {
  const [displayName, setDisplayName] = useState("HAPPY");
  const [activeIndex, setActiveIndex] = useState(3);
  const eyeAsset = activeIndex % 2 === 0 ? eyesAngry : eyesSad;
  const mouthAsset = [mouthAngry, mouthSemiSad, mouthWhistle][activeIndex % 3];

  return (
    <section className="slop-creator-shell" aria-labelledby="create-a-slop-heading">
      <div className="slop-creator-left">
        <div className="slop-creator-name-wrap">
          <label className="sr-only" htmlFor="create-a-slop-heading">
            Character display name
          </label>
          <input
            id="create-a-slop-heading"
            type="text"
            value={displayName}
            maxLength={18}
            onChange={(event) => setDisplayName(event.target.value.toUpperCase())}
            className="slop-creator-name-input"
            spellCheck={false}
          />
        </div>

        <div className="slop-creator-meta-block" aria-label="Character progress">
          <span className="slop-creator-meta-line">LVL 27</span>
          <span className="slop-creator-meta-line">SLOP COINS 04250</span>
        </div>

        <div className="slop-creator-capsule-stack" aria-label="Customization categories">
          {creatorCategories.map((category, index) => {
            const distance = Math.abs(index - activeIndex);

            return (
              <button
                key={category.key}
                type="button"
                className={`slop-creator-capsule ${getCapsuleClass(distance)}`}
                onClick={() => setActiveIndex(index)}
                aria-pressed={index === activeIndex}
              >
                <span className="slop-creator-capsule-text">{category.label}</span>
                <span className="slop-creator-capsule-sub">/YHAPOJJ</span>
                {index === activeIndex ? <span className="slop-creator-capsule-arrow" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>

        <section className="slop-creator-stats" aria-label="Current category stats">
          <div className="slop-creator-stats-title">Layer Type</div>
          <div className="slop-creator-stats-grid">
            {statRows.map((row) => (
              <div key={row.label} className="slop-creator-stat-row">
                <span className="slop-creator-stat-label">{row.label}</span>
                <div className="slop-creator-stat-meter">
                  <span
                    className="slop-creator-stat-fill"
                    style={{ width: `${row.values[activeIndex]}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="slop-creator-stage-shell">
        <div className="slop-creator-stage">
          <div className="slop-creator-stage-grid" aria-hidden="true" />
          <div className="slop-creator-stage-floor" aria-hidden="true" />

          <div className="slop-creator-stage-tools" aria-hidden="true">
            <span className="slop-creator-stage-tool" />
            <span className="slop-creator-stage-tool" />
            <span className="slop-creator-stage-tool" />
            <span className="slop-creator-stage-tool" />
          </div>

          <div className="slop-creator-character" aria-label="Character preview built from uploaded SVG parts">
            <div className="slop-creator-part slop-creator-part-leg1">
              <Image src={leg1} alt="" fill unoptimized className="slop-creator-part-image" />
            </div>
            <div className="slop-creator-part slop-creator-part-leg2">
              <Image src={leg2} alt="" fill unoptimized className="slop-creator-part-image" />
            </div>
            <div className="slop-creator-part slop-creator-part-arm1">
              <Image src={arm1} alt="" fill unoptimized className="slop-creator-part-image" />
            </div>
            <div className="slop-creator-part slop-creator-part-body">
              <Image src={body} alt="" fill unoptimized className="slop-creator-part-image" />
            </div>
            <div className="slop-creator-part slop-creator-part-arm2">
              <Image src={arm2} alt="" fill unoptimized className="slop-creator-part-image" />
            </div>
            <div className="slop-creator-part slop-creator-part-head">
              <Image src={head} alt="" fill unoptimized className="slop-creator-part-image" />
            </div>
            <div className="slop-creator-part slop-creator-part-eyes">
              <Image src={eyeAsset} alt="" fill unoptimized className="slop-creator-part-image" />
            </div>
            <div className="slop-creator-part slop-creator-part-lashes">
              <Image src={lashes} alt="" fill unoptimized className="slop-creator-part-image" />
            </div>
            <div className="slop-creator-part slop-creator-part-mouth">
              <Image src={mouthAsset} alt="" fill unoptimized className="slop-creator-part-image" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
