// src/components/HPAdjuster.jsx
import { useState } from "react";

/**
 * Damage / healing / temporary HP controls for a single combatant.
 *
 * Props:
 *   hp, maxHp, tempHp - current values
 *   onDamage(amount)  - damage hits temp HP first
 *   onHeal(amount)    - capped at maxHp, never restores temp HP
 *   onSetTempHp(value)- replaces the current pool (5e: temp HP doesn't stack)
 */
const HPAdjuster = ({ hp, maxHp, tempHp = 0, onDamage, onHeal, onSetTempHp }) => {
  const [amount, setAmount] = useState("");
  const [temp, setTemp] = useState("");

  const submit = (action) => {
    const value = parseInt(amount, 10);
    if (!Number.isFinite(value) || value <= 0) return;
    action(value);
    setAmount("");
  };

  const commitTemp = () => {
    if (temp === "") return;
    onSetTempHp(temp);
    setTemp("");
  };

  const handleAmountKey = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    // Enter damages, Shift+Enter heals - keeps hands off the mouse mid-combat.
    submit(e.shiftKey ? onHeal : onDamage);
  };

  const handleTempKey = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    commitTemp();
  };

  const pool = tempHp > 0 ? hp + tempHp : hp;
  const barPercent = maxHp > 0 ? Math.min(100, (hp / maxHp) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Current totals */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold tabular-nums">{hp}</span>
        <span className="text-slate-400">/ {maxHp}</span>
        {tempHp > 0 && (
          <span className="text-sky-300 text-sm font-medium">
            +{tempHp} temp
          </span>
        )}
        {tempHp > 0 && (
          <span className="text-slate-500 text-xs">({pool} effective)</span>
        )}
      </div>

      {/* HP bar, with temp shown as a distinct segment */}
      <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded bg-slate-700">
        <div
          className="h-full rounded-l bg-emerald-500 transition-all"
          style={{ width: `${barPercent}%` }}
        />
        {tempHp > 0 && (
          <div
            className="h-full bg-sky-400 transition-all"
            style={{ width: `${Math.min(100, (tempHp / maxHp) * 100)}%` }}
          />
        )}
      </div>

      {/* Damage / heal */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={handleAmountKey}
          placeholder="0"
          aria-label="Damage or healing amount"
          className="field field-sm w-16 text-center"
        />
        <button
          type="button"
          onClick={() => submit(onDamage)}
          title="Apply damage (Enter)"
          className="btn btn-danger btn-sm"
        >
          Damage
        </button>
        <button
          type="button"
          onClick={() => submit(onHeal)}
          title="Heal (Shift+Enter)"
          className="btn btn-success btn-sm"
        >
          Heal
        </button>
      </div>

      {/* Temp HP */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-400" htmlFor="temp-hp-input">
          Temp HP
        </label>
        <input
          id="temp-hp-input"
          type="number"
          min="0"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          onKeyDown={handleTempKey}
          onBlur={commitTemp}
          placeholder={String(tempHp)}
          className="field field-sm w-16 text-center"
        />
        {tempHp > 0 && (
          <button
            type="button"
            onClick={() => onSetTempHp(0)}
            className="text-sm text-slate-400 underline hover:text-slate-200"
          >
            Clear
          </button>
        )}
        <span className="text-xs text-slate-500">Replaces, doesn't stack</span>
      </div>
    </div>
  );
};

export default HPAdjuster;
