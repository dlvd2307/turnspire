// src/components/CharacterPanel.jsx
import { useCombat } from "../context/CombatContext";

const CharacterPanel = () => {
  const {
    selectedCharacterId,
    characters,
    removeCondition,
    clearConcentration,
    markDefeated,
    removeCharacter,
    updateCharacterHP,
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

  const isDown = hp === 0 && !defeated;
  const successes = deathSaves?.success ?? 0;
  const fails = deathSaves?.fail ?? 0;
  const stable = deathSaves?.stable ?? false;

  return (
    <div className="bg-gray-800 text-white p-4 rounded shadow max-w-md w-full mt-4 space-y-3">
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

      <p>
        HP:{" "}
        <input
          type="number"
          value={hp}
          onChange={(e) => updateCharacterHP(id, parseInt(e.target.value) || 0)}
          className="ml-2 w-16 text-black px-1 rounded"
        />{" "}
        / {maxHp}
      </p>

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
          className="ml-2 w-16 text-black px-1 rounded"
        />
      </p>

      <p>
        Initiative:{" "}
        <input
          type="number"
          value={initiative ?? ""}
          onChange={(e) => updateCharacterInitiative(id, e.target.value)}
          className="ml-2 w-16 text-black px-1 rounded"
        />
      </p>

      <p>Type: {type === "enemy" ? "Enemy" : "Character"}</p>

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
                  className="bg-green-700 hover:bg-green-800 text-white px-2 py-1 rounded text-sm"
                >
                  + Success
                </button>
                <button
                  onClick={() => recordDeathSaveFailure(id)}
                  className="bg-red-700 hover:bg-red-800 text-white px-2 py-1 rounded text-sm"
                >
                  + Failure
                </button>
                <button
                  onClick={() => clearDeathSaves(id)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-sm"
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
                className="flex items-center justify-between bg-gray-700 px-2 py-1 rounded"
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
          <div className="flex items-center justify-between bg-gray-700 px-2 py-1 rounded">
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
