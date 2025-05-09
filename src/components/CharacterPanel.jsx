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
  } = useCombat();

  const selectedCharacter = characters.find((char) => char.id === selectedCharacterId);
  if (!selectedCharacter) return null;

  const { id, name, hp, maxHp, ac, type, conditions, concentration, defeated } = selectedCharacter;

  const handleRemove = () => {
    const confirmed = confirm(`Remove ${name} from the board?`);
    if (confirmed) removeCharacter(id);
  };

  const handleDefeat = () => {
    if (!defeated) markDefeated(id);
  };

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
        />
        {" "} / {maxHp}
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

      <p>Type: {type === "enemy" ? "Enemy" : "Character"}</p>

      {conditions.length > 0 && (
        <div>
          <h3 className="font-semibold mb-1">Conditions:</h3>
          <ul className="space-y-1">
            {conditions.map((cond, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-700 px-2 py-1 rounded"
              >
                <span>{cond.name} ({cond.remainingRounds} round{cond.remainingRounds > 1 ? "s" : ""})</span>
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
            <span>{concentration.spell} ({concentration.remainingRounds} round{concentration.remainingRounds > 1 ? "s" : ""})</span>
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
