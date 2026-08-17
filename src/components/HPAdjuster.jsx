// src/components/HPAdjuster.jsx
import { useState } from "react";

/**
 * Compact damage/heal control.
 *
 * Props:
 *   hp      - current hit points (number)
 *   maxHp   - maximum hit points (number) - caps healing
 *   onApply - (newHp) => void
 */
const HPAdjuster = ({ hp, maxHp, onApply }) => {
  const [amount, setAmount] = useState("");

  const apply = (sign) => {
    const value = parseInt(amount, 10);
    if (!Number.isFinite(value) || value <= 0) return;

    const ceiling = Number.isFinite(maxHp) ? maxHp : Infinity;
    const next =
      sign < 0
        ? Math.max(0, hp - value)
        : Math.min(ceiling, hp + value);

    onApply(next);
    setAmount("");
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    // Enter damages, Shift+Enter heals - keeps hands off the mouse mid-combat.
    apply(e.shiftKey ? 1 : -1);
  };

  return (
    <span className="inline-flex items-center gap-1 ml-2">
      <input
        type="number"
        min="1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="0"
        aria-label="Amount to apply"
        className="w-14 px-1 rounded text-black text-center"
      />
      <button
        type="button"
        onClick={() => apply(-1)}
        title="Apply damage (Enter)"
        className="bg-red-700 hover:bg-red-800 text-white px-2 py-0.5 rounded text-sm"
      >
        Damage
      </button>
      <button
        type="button"
        onClick={() => apply(1)}
        title="Heal (Shift+Enter)"
        className="bg-green-700 hover:bg-green-800 text-white px-2 py-0.5 rounded text-sm"
      >
        Heal
      </button>
    </span>
  );
};

export default HPAdjuster;
