"use client";

import NeonButton from "../ui/NeonButton";
import SlopCharacterPreview from "../character/SlopCharacterPreview";
import { type CharacterConfig } from "../slopOptions";

type ShopTryOnPreviewProps = {
  config: CharacterConfig;
  previewItemIds: string[];
  tryOnMode: boolean;
  onToggleTryOn: () => void;
  onReset: () => void;
  onBuyEquipped: () => void;
};

export default function ShopTryOnPreview({
  config,
  previewItemIds,
  tryOnMode,
  onToggleTryOn,
  onReset,
  onBuyEquipped,
}: ShopTryOnPreviewProps) {
  return (
    <div className="slop-shop-preview-panel">
      <div className="slop-shop-preview-stage">
        <SlopCharacterPreview config={config} equippedShopItemIds={previewItemIds} backdrop />
      </div>
      <div className="slop-shop-preview-controls">
        <button type="button" className="slop-shop-tryon-toggle" onClick={onToggleTryOn}>
          <span>Try On Mode</span>
          <strong>{tryOnMode ? "ON" : "OFF"}</strong>
        </button>
        <div className="slop-shop-preview-actions">
          <NeonButton variant="gold" onClick={onBuyEquipped}>
            Buy Equipped
          </NeonButton>
          <NeonButton variant="purple" onClick={onReset}>
            Reset Try-On
          </NeonButton>
        </div>
        <p className="slop-shop-preview-copy">Mix and match items before you buy.</p>
      </div>
    </div>
  );
}
