import { useCombat } from "../context/CombatContext";
import Draggable from "react-draggable";

const CharacterPanel = () => {
  const {
    selectedCharacterId,
    characters,
    removeCondition,
    clearConcentration,
  } = useCombat();

  const selectedCharacter = characters.find((char) => char.id === selectedCharacterId);
  if (!selectedCharacter) return null;

  const { name, hp, maxHp, type, conditions, concentration } = selectedCharacter;

  return (
    <Draggable handle=".handle">
      <div className="z-50 fixed left-1/2 top-1/4 transform -translate-x-1/2 bg-gray-800 text-white p-4 rounded shadow-lg max-w-sm w-full">
        <div className="handle cursor-move mb-2">
          <h2 className="text-xl font-semibold">{name}</h2>
        </div>

        <p className="mb-2">HP: {hp} / {maxHp}</p>
        <p className="mb-2">Type: {type === "enemy" ? "Enemy" : "Character"}</p>

        {conditions.length > 0 && (
          <div className="mb-2">
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
                    onClick={() => removeCondition(selectedCharacter.id, cond.name)}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {concentration && (
          <div className="mt-2">
            <h3 className="font-semibold mb-1">Concentration:</h3>
            <div className="flex items-center justify-between bg-gray-700 px-2 py-1 rounded">
              <span>{concentration.spell} ({concentration.remainingRounds} round{concentration.remainingRounds > 1 ? "s" : ""})</span>
              <button
                className="text-red-400 hover:text-red-600 ml-2"
                onClick={() => clearConcentration(selectedCharacter.id)}
              >
                ❌
              </button>
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default CharacterPanel;
