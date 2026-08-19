// src/components/CharacterPanel.jsx
import { useCombat } from "../context/CombatContext";
import HPAdjuster from "./HPAdjuster";

const CharacterPanel = () => {
  const {
    selectedCharacterId,
    characters,
    removeCondition,
    clearConcentration,
    markDefeated,
    removeCharacter,
    updateCharacterHP,
    applyDamage,
    applyHealing,
    setTemporaryHP,
    updateCharacterAC,
    updateCharacterInitiative,
    recordDeathSaveSuccess,
    recordDeathSaveFailure,
    clearDeathSaves,
  } = useCombat();

  const selectedCharacter = characters.find((char) => char.id === selectedCharacterId);
  if (!selectedCharacter) return null;

  const {
    id,
    name,
    hp,
    maxHp,
    tempHp,
    ac,
    initiative,
    type,
    conditions,
    concentration,
    defeated,
    deathSaves,
  } = selectedCharacter;

  const handleRemove = () => {
    const confirmed = confirm(`Remove ${name} from the board?`);
    if (confirmed) removeCharacter(id);
  };

  const handleDefeat = () => {
    if (!defeated) markDefeated(id);
  };

  // Death saves apply to player characters only - enemies simply drop.
  const isDown = hp === 0 && !defeated && type !== "enemy";
  const enemyDropped = hp === 0 && !defeated && type === "enemy";
  const successes = deathSaves?.success ?? 0;
  const fails = deathSaves?.fail ?? 0;
  const stable = deathSaves?.stable ?? false;

  return (
    <div className="panel mt-4 w-full max-w-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{name}</h2>
        <div className="space-x-2">
          {!defeated && (
            <button
              onClick={handleDefeat}
              className="text-yellow-400 hover:text-yellow-300 text-sm"
              title="Mark as defeated"
            >
              ❌
            </button>
          )}
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-400 text-sm"
            title="Remove from board"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="rounded bg-slate-900/60 p-3">
        <HPAdjuster
          hp={hp}
          maxHp={maxHp}
          tempHp={tempHp ?? 0}
          onDamage={(value) => applyDamage(id, value)}
          onHeal={(value) => applyHealing(id, value)}
          onSetTempHp={(value) => setTemporaryHP(id, value)}
        />
        <div className="mt-3 flex items-center gap-2 border-t border-slate-700 pt-2">
          <label className="text-xs text-slate-500" htmlFor="hp-direct">
            Set HP directly
          </label>
          <input
            id="hp-direct"
            type="number"
            value={hp}
            onChange={(e) => updateCharacterHP(id, parseInt(e.target.value) || 0)}
            className="w-16 rounded border border-slate-700 bg-slate-900 px-2 py-0.5
                       text-center text-sm tabular-nums text-white
                       focus:border-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <p>
        AC:{" "}
        <input
          type="number"
          value={ac ?? ""}
          onChange={(e) => {
          const val = e.target.value;
          const parsed = parseInt(val);
          if (!isNaN(parsed)) {
            updateCharacterAC(id, parsed);
          } else if (val === "") {
            updateCharacterAC(id, 0);
          }
        }}
          className="field field-sm ml-2 w-16 text-center"
        />
      </p>

      <p>
        Initiative:{" "}
        <input
          type="number"
          value={initiative ?? ""}
          onChange={(e) => updateCharacterInitiative(id, e.target.value)}
          className="field field-sm ml-2 w-16 text-center"
        />
      </p>

      <p>Type: {type === "enemy" ? "Enemy" : "Character"}</p>

      {enemyDropped && (
        <div className="flex items-center justify-between gap-3 rounded-lg border
                        border-amber-500/30 bg-amber-500/10 px-3 py-2">
          <span className="text-sm text-amber-200">Reduced to 0 HP</span>
          <button
            onClick={handleDefeat}
            className="btn btn-sm btn-danger"
          >
            Mark Defeated
          </button>
        </div>
      )}

      {/* Death Saves */}
      {isDown && (
        <div className="mt-2">
          <h3 className="font-semibold mb-1">Death Saves</h3>

          {stable ? (
            <p className="text-green-400">Stabilized</p>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span>Successes: {"✅".repeat(successes)}{" "}
                  {"⬜".repeat(3 - successes)}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span>Failures: {"❌".repeat(fails)}{" "}
                  {"⬜".repeat(3 - fails)}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => recordDeathSaveSuccess(id)}
                  className="btn btn-sm btn-success"
                >
                  + Success
                </button>
                <button
                  onClick={() => recordDeathSaveFailure(id)}
                  className="btn btn-sm btn-danger"
                >
                  + Failure
                </button>
                <button
                  onClick={() => clearDeathSaves(id)}
                  className="btn btn-sm btn-secondary"
                >
                  Reset
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {defeated && (
        <p className="text-red-400 font-semibold">Dead</p>
      )}

      {conditions.length > 0 && (
        <div>
          <h3 className="font-semibold mb-1">Conditions:</h3>
          <ul className="space-y-1">
            {conditions.map((cond, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-slate-700 px-2 py-1 rounded"
              >
                <span>
                  {cond.name} ({cond.remainingRounds} round
                  {cond.remainingRounds > 1 ? "s" : ""})
                </span>
                <button
                  className="text-red-400 hover:text-red-600 ml-2"
                  onClick={() => removeCondition(id, cond.name)}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {concentration && (
        <div>
          <h3 className="font-semibold mb-1">Concentration:</h3>
          <div className="flex items-center justify-between bg-slate-700 px-2 py-1 rounded">
            <span>
              {concentration.spell} ({concentration.remainingRounds} round
              {concentration.remainingRounds > 1 ? "s" : ""})
            </span>
            <button
              className="text-red-400 hover:text-red-600 ml-2"
              onClick={() => clearConcentration(id)}
            >
              ❌
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterPanel;
